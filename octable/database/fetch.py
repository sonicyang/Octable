import sqlite3 as lite
from bs4 import BeautifulSoup
import os
import urllib.request

opener = urllib.request.build_opener()

def main():
    pIndex = opener.open("http://course-query.acad.ncku.edu.tw/qry/index.php", timeout=100)
    sIndex = pIndex.read().decode("utf-8", "ignore")
    soupIndex = BeautifulSoup(sIndex)
    departmentList = soupIndex.select('.dept')

    for e in departmentList:
        print(e.select("a")[0]["href"][-2:])

    con  = lite.connect("course.db")
    with con:
        cur = con.cursor()
        cur.execute('SELECT SQLITE_VERSION()')

        data = cur.fetchone()

        print(data)



if __name__ == "__main__":
    main()