from hijridate import Hijri

day = Hijri.today().day
month = Hijri.today().month_name()
year = Hijri.today().year

print(f"{day} {month} {year}")