import sqlite3 as lite
from bs4 import BeautifulSoup
import os
import urllib.request

def main():
	con  = lite.connect("course.db")
	with con:
		cur = con.cursor()
		cur.execute('SELECT SQLITE_VERSION()')

		data = cur.fetchone()

		print(data)



if __name__ == "__main__":
	main()