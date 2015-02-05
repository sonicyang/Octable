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
            cur.execute("CREATE TABLE " + e.select("a")[0]["href"][-2:] + "(ID INT, SerialNum INT, CourseNum INT, ClassNum TEXT, Class INT, Grade INT, TYPE TEXT, GRP INT, ENG INT, Name TEXT, Optional INT, Credits INT, Prof TEXT, Selected INT, Free INT, Day INT, HourStart INT, HourEnd INT, Place TEXT, Memo TEXT, Restriction TEXT, Industrial INT, Property TEXT, Moocs INT)")
            print("Table for Department " + e.select("a")[0]["href"][-2:] + " Created!")
        except:
            print("Table for Department " + e.select("a")[0]["href"][-2:] + " already Exist!")
            print("Pure Updating Table...");

if __name__ == "__main__":
    main()