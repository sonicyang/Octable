import sqlite3 as lite
from bs4 import BeautifulSoup
import os
import urllib.request

opener = urllib.request.build_opener()

def main():
    print("Connecting Database...")
    con  = lite.connect("course.db")
    cur = con.cursor()

    cur.execute('SELECT SQLITE_VERSION()')
    print("Connected, SQLite Version : " + cur.fetchone()[0])

    print("Uplinking with Query Server...")
    pIndex = opener.open("http://course-query.acad.ncku.edu.tw/qry/index.php", timeout=100)
    sIndex = pIndex.read().decode("utf-8", "ignore")

    print("Linked, Pasrsing Data...")
    soupIndex = BeautifulSoup(sIndex)
    departmentList = soupIndex.select('.dept')

    for e in departmentList:
        print("Updating Department : " + e.select("a")[0]["href"][-2:])
        try:
            cur.execute("CREATE TABLE " + e.select("a")[0]["href"][-2:] + "(ID INT, SerialNum INT, CourseNum TEXT, ClassNum TEXT, Class INT, Grade INT, TYPE TEXT, GRP INT, ENG INT, Name TEXT, Optional INT, Credits INT, Prof TEXT, Selected INT, Free INT, MON INT, TUE INT, WED INT, THS INT, FRI INT, SAT INT, Place TEXT, Memo TEXT, Restriction TEXT, Industrial INT, Property TEXT, Moocs INT)")
            print("Table for Department " + e.select("a")[0]["href"][-2:] + " Created!")
        except:
            print("Table for Department " + e.select("a")[0]["href"][-2:] + " already Exist!")
            print("Pure Updating Table...");

        print("Retriving Course Data for Department : " + e.select("a")[0]["href"][-2:])
        pDept = opener.open("http://course-query.acad.ncku.edu.tw/qry/qry001.php?dept_no=" + e.select("a")[0]["href"][-2:], timeout=100)
        sDept = pDept.read().decode("utf-8", "ignore")

        print("Pasrsing Data...")
        soupDept = BeautifulSoup(sDept)

        deptMaxYear = 0;
        for i in range(10,  0, -1):
            if len(soupDept.select('.course_y' + str(i))) > 0:
                deptMaxYear = i
                break
        print("Department " + e.select("a")[0]["href"][-2:] + " has total years of " + str(deptMaxYear))

        print("Course Data for Department " + e.select("a")[0]["href"][-2:] + " :")
        for yr in range(0,  deptMaxYear + 1):
            courses = soupDept.select('.course_y' + str(yr))
            for c in courses:
                cols = c.select('td')

                sqlcode = "INSERT INTO " + e.select("a")[0]["href"][-2:] + "(SerialNum, CourseNum, ClassNum, Class, Grade, TYPE, GRP, ENG, Name, Optional, Credits, Prof, Selected, Free, MON, TUE, WED, THS, FRI, SAT, Place, Memo, Restriction, Industrial, Property, Moocs) VALUES("

                print("SerialNum : " + cols[2].getText())
                sqlcode += cols[2].getText() + ","
                
                print("CourseNum : " + cols[2].getText())
                sqlcode += "'" + cols[3].getText() + "'" + ","

                print("ClassNum : " + cols[2].getText())
                sqlcode += "'" + cols[4].getText() + "'" + ","

                print("Class : " + cols[2].getText())
                tmp = 0
                if "甲" in cols[5].getText():
                    tmp += 1
                if "乙" in cols[5].getText():
                    tmp += 2
                if "丙" in cols[5].getText():
                    tmp += 4
                if "一年級" in cols[5].getText():
                    tmp += 8
                if "二年級" in cols[5].getText():
                    tmp += 16
                if "校代表隊" in cols[5].getText():
                    tmp += 32
                if "不限年級" in cols[5].getText():
                    tmp += 8 + 16
                sqlcode += str(tmp) + ","

                print("Grade : " + cols[6].getText())
                sqlcode += cols[6].getText() + ","
                

                print("TYPE : " + cols[7].getText())
                sqlcode += "'" + cols[7].getText() + "'" + ","

                print("Group : " + cols[8].getText())
                tmp = 0
                if cols[8].getText() == "A" or cols[8].getText() == "1":
                    tmp = 1
                elif cols[8].getText() == "B" or cols[8].getText() == "2":
                    tmp = 2
                elif cols[8].getText() == "C" or cols[8].getText() == "3":
                    tmp = 3
                elif cols[8].getText() == "D" or cols[8].getText() == "4":
                    tmp = 4
                elif cols[8].getText() == "E" or cols[8].getText() == "5":
                    tmp = 5
                elif cols[8].getText() == "F" or cols[8].getText() == "6":
                    tmp = 6
                elif cols[8].getText() == "G" or cols[8].getText() == "7":
                    tmp = 7
                elif cols[8].getText() == "H" or cols[8].getText() == "8":
                    tmp = 8
                elif cols[8].getText() == "" or cols[8].getText() == " ":
                    tmp = 0
                else:
                    raise
                sqlcode += str(tmp) + ","
                
                print("English : " + cols[9].getText())
                if cols[9].getText() == "Y":
                    sqlcode += "1" + ","
                elif cols[9].getText() == "N":
                    sqlcode += "0" + ","
                else:
                    raise

                print("Name : " + cols[10].getText())
                sqlcode += "'" + cols[10].getText() + "'" + ","

                print("Optional? : " + cols[11].getText())
                if cols[11].getText() == "必修":
                    sqlcode += "0" + ","
                elif cols[11].getText() == "選修":
                    sqlcode += "1" + ","
                elif cols[11].getText() == "必選":
                    sqlcode += "2" + ","
                else:
                    raise

                print("Credits : " + cols[12].getText())
                sqlcode += cols[12].getText() + ","

                """print("Professor : " + cols[13].getText().encode( errors="ignore"))"""
                sqlcode += "'" + cols[13].getText() + "'" + ","

                print("Selected : " + cols[14].getText())
                sqlcode += cols[14].getText() + ","

                print("Free : " + cols[15].getText())
                sqlcode += cols[15].getText() + ","


                dayData = [0, 0, 0, 0, 0, 0]
                sFlag = 0
                DayHolder = 0
                LinkHolder = 0
                LastReaded = 0
                print("Time : " + cols[16].getText())
                for j in range(0, len(cols[16].getText())):
                    if cols[16].getText()[j] == "[" and not sFlag:
                        sFlag = 1
                        DayHolder = 0
                    elif cols[16].getText()[j] == "]" and sFlag:
                        sFlag = 0
                    elif sFlag:
                        DayHolder = int(cols[16].getText()[j])
                    elif cols[16].getText()[j] == "~":
                        LinkHolder = 1
                    elif not sFlag:
                        if not LinkHolder:
                            if cols[16].getText()[j] == "1":
                                dayData[DayHolder - 1] += 1
                                LastReaded = 1
                            elif cols[16].getText()[j] == "2":
                                dayData[DayHolder - 1] += 2
                                LastReaded = 2
                            elif cols[16].getText()[j] == "3":
                                dayData[DayHolder - 1] += 4
                                LastReaded = 3
                            elif cols[16].getText()[j] == "4":
                                dayData[DayHolder - 1] += 8
                                LastReaded = 4
                            elif cols[16].getText()[j] == "N":
                                dayData[DayHolder - 1] += 16
                                LastReaded = 5
                            elif cols[16].getText()[j] == "5":
                                dayData[DayHolder - 1] += 32
                                LastReaded = 6
                            elif cols[16].getText()[j] == "6":
                                dayData[DayHolder - 1] += 64
                                LastReaded = 7
                            elif cols[16].getText()[j] == "7":
                                dayData[DayHolder - 1] += 128
                                LastReaded = 8
                            elif cols[16].getText()[j] == "8":
                                dayData[DayHolder - 1] += 256
                                LastReaded = 9
                            elif cols[16].getText()[j] == "9":
                                dayData[DayHolder - 1] += 512
                                LastReaded = 10
                            elif cols[16].getText()[j] == "A":
                                dayData[DayHolder - 1] += 1024
                                LastReaded = 11
                            elif cols[16].getText()[j] == "B":
                                dayData[DayHolder - 1] += 2048
                                LastReaded = 12
                            elif cols[16].getText()[j] == "C":
                                dayData[DayHolder - 1] += 4096
                                LastReaded = 13
                            elif cols[16].getText()[j] == "D":
                                dayData[DayHolder - 1] += 8192
                                LastReaded = 14
                        else:
                            tmp = 0
                            if cols[16].getText()[j] == "2":
                                tmp = 2
                            elif cols[16].getText()[j] == "3":
                                tmp = 3
                            elif cols[16].getText()[j] == "4":
                                tmp = 4
                            elif cols[16].getText()[j] == "N":
                                tmp = 5
                            elif cols[16].getText()[j] == "5":
                                tmp = 6
                            elif cols[16].getText()[j] == "6":
                                tmp = 7
                            elif cols[16].getText()[j] == "7":
                                tmp = 8
                            elif cols[16].getText()[j] == "8":
                                tmp = 9
                            elif cols[16].getText()[j] == "9":
                                tmp = 10
                            elif cols[16].getText()[j] == "A":
                                tmp = 11
                            elif cols[16].getText()[j] == "B":
                                tmp = 12
                            elif cols[16].getText()[j] == "C":
                                tmp = 13
                            elif cols[16].getText()[j] == "D":
                                tmp = 14
                            for l in range(LastReaded + 1, tmp + 1):
                                dayData[DayHolder - 1] += 2 ** (l - 1)
                            LinkHolder = 0
                    else:
                        raise

                sqlcode += str(dayData[0]) + ","
                sqlcode += str(dayData[1]) + ","
                sqlcode += str(dayData[2]) + ","
                sqlcode += str(dayData[3]) + ","
                sqlcode += str(dayData[4]) + ","
                sqlcode += str(dayData[5]) + ","

                if len(cols[17].select("a")) > 0:
                    print("Place : " + cols[17].select("a")[0].getText())
                    sqlcode += "'" + cols[17].select("a")[0].getText() + "'" + ","
                else:
                    sqlcode += "''" + ","

                print("Memo : " + cols[18].getText())
                sqlcode += "'" + cols[18].getText() + "'" + ","

                print("Restriction : " + cols[19].getText())
                sqlcode += "'" + cols[19].getText() + "'" + ","

                print("Industrial : " + cols[20].getText())
                if cols[20].getText() == "是":
                    sqlcode += "1" + ","
                elif cols[20].getText() == "否":
                    sqlcode += "0" + ","
                else:
                    raise

                print("Property : " + cols[21].getText())
                sqlcode += "'" + cols[21].getText() + "'" + ","

                print("Moocs : " + cols[23].getText())
                if cols[23].getText() == "是":
                    sqlcode += "1" + ","
                elif cols[23].getText() == "否":
                    sqlcode += "0" + ","
                else:
                    raise

                sqlcode += ");"

                print("========================================")

if __name__ == "__main__":
    main()