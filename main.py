import click
from hijridate import Hijri

@click.command()
@click.option(
    '--format',
    default='dmy',
    show_default=True,
    type=click.Choice(['dmy', 'mdy', 'ymd'], case_sensitive=False),
    help="Order of the date components: d=day, m=month, y=year."
)
@click.option(
    '--month-num',
    is_flag=True,
    default=False,
    help="Show the month as a number instead of the name."
)
def hijri_date(format, month_num):
    """Print today's date in the Hijri calendar with customizable format."""
    today = Hijri.today()
    
    day = str(today.day)
    month = str(today.month) if month_num else today.month_name()
    year = str(today.year)

    components = {
        'd': day,
        'm': month,
        'y': year,
    }

    # Build output string based on format
    output = ' '.join(components[ch] for ch in format.lower())
    click.echo(output)

if __name__ == "__main__":
    hijri_date()
