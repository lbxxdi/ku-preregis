from bs4 import BeautifulSoup
import pprint
from multiprocessing import Pool
from pymongo import MongoClient
import sys
import copy




pp = pprint.PrettyPrinter(indent=4)
pprint = pp.pprint


dayweek = { 'จ': 0, 'อ': 1, 'พ': 2, 'พฤ': 3, 'ศ': 4, 'ส': 5 ,'อา':6}

def create_period(t,code):
    period={}
    date_split = t.split(".")

    try:
        day = dayweek[date_split[0]]
    except:
        if t not in ["ติดต่อผู้สอน", "ดต่อภาควิชา", "ดต่อผู้สอน", ""]:
            print(code,"incorrect day :", t)
        return period

    time = ".".join(date_split[1:])
    
    try:
        s,e = time.split('-')
    except:
        try:
            if len(time) == 10:
                s,e = time[0:5],time[5:10]
            elif len(time) == 11:
                s,e = time[0:5],time[6:11]
            else:
                raise ValueError(code,"incorrect time format :",time)
        except:
            raise ValueError(code,"incorrect time format :",time)
        print(code,"incorrect time format:",time)    
        
    try:
        s_hr,s_m = s.split(".")
    except:
        if(len(s) == 4 and int(s)):
            s_hr,s_m = s[0:2],s[2:4]
        else:
            raise ValueError(code,"incorrect start-time :",s)    
        print(code,"incorrect start-time format:",s)    
    
    try:
        start = int(s_hr)+int(s_m)/60.0;
    except:    
        raise ValueError(code,"cannot int start-time",s)


    try:
        e_hr,e_m = e.split(".")
    except:
        if(len(e) == 4 and int(e)):
            e_hr,e_m = e[0:2],e[2:4]
        else:
            raise ValueError(code,"incorrect end-time :",e)    
        print(code,"incorrect end-time format:",e)     

    try:
        end = int(e_hr)+int(e_m)/60.0;
    except:
        raise ValueError(code,"cannot int end-time",e)

    period['day']   = day
    period['start'] = start
    period['end']   = end

    return period


def parse_line(i):

    html_doc = i

    soup = BeautifulSoup(html_doc,'html.parser')

    found_p = soup.find_all('p')

    if(not found_p): return False

    temp  = BeautifulSoup(str(list(found_p)[0]),'html.parser')
    list_header = temp.get_text().split()

    subject= {}

    if '<br /><' in html_doc:
        subject['code'] = list_header[2]
        subject['name'] = list_header[0]
        return False

    soup = BeautifulSoup(html_doc.replace('<br />',', '),'html.parser')
    temp  = BeautifulSoup(str(list(soup.find_all('p'))[0]),'html.parser')

    list_header = temp.get_text().split()
    subject['code'] = list_header[0]
    name = ''
    count = 1
    for i in range(1,len(list_header)):
        if list_header[i]!='บรรยาย':
            name+=list_header[i]+' '
        else:
            count = i
            break
    subject['name'] = name.strip()

    subject['lec'] = list_header[count+2]
    subject['lab'] = list_header[count+6]

    temp = soup.find('table')
    table = temp

    rows = table.find_all('tr')

    list_of_section = []
    list_of_period = {}
    section = {}
    for row in rows:
        period = {}
        cols = row.find_all('td')
        cols = [ele.text.strip() for ele in cols]
        
        if(len(cols) == 0):
            continue
        if(len(cols) == 2):
            period = create_period(cols[0],subject['code'])
            if not period: 
                continue
            period['room'] = cols[1]
            list_of_section[-1]['period'].append(period)
        else:
            section = {}
            section['sec'] = int(cols[2])
            section['period']=[]

            if cols[1] =='บรรยาย':
                section['type']='LEC'
            else:
                section['type']='LAB'
            section['teacher'] = cols[5]
            
            period = create_period(cols[3],subject['code'])

            if not period: 
                list_of_section.append(section)
                continue

            period['room'] = cols[4]
            section['period'].append(period)

            list_of_section.append(section)

    subject['section'] = list_of_section


    return subject


if __name__ == '__main__':


    print("=="*50)

    file_name = sys.argv[1]

    to_line = None

    f = open(file_name,'r+',encoding = "utf-8")
    lines = f.readlines()[:to_line]

    client = MongoClient('localhost', 27017)
    db_subject = client.preregis.subject


    db_subject.drop()

    pool = Pool()

    result = pool.imap(parse_line,lines)
    pool.close()
    pool.join()


    print("=="*50)

    result = [ res for res in result if res ] 

    subjects = []
    
    for subject in result:
    
        temp = copy.copy(subject)
        #del temp['section']     
        subjects.append(temp)

    print("subject count",len(subjects))

    db_subject.insert_many(subjects)

    print("inserted subjects.",db_subject.count())


    db_section = client.preregis.section

    db_section.drop()


    sections = []
    for subject in result:
        #pprint(subject)
        for sec in subject['section']:
            sec['code'] = subject['code'] 

            #pprint(sec)
            sections.append(sec)

    print("=="*50)

    print("section count",len(sections))

    db_section.insert_many(sections) 

    print("inserted section.",db_section.count())

    print("=="*50)

# Subject
#  - id
#  - name
#  Section
#    - id
#    - type
#    Period
#       -  startTime
#       -  endTime
#       -  day
#       -  room
