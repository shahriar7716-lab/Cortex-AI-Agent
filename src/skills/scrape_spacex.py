import requests
from bs4 import BeautifulSoup
import os

# Send a GET request to the Wikipedia page
url = 'https://en.wikipedia.org/wiki/SpaceX'
response = requests.get(url)

# If the GET request is successful, the status code will be 200
if response.status_code == 200:
    # Get the content of the response
    page_content = response.content

    # Create a BeautifulSoup object and specify the parser
    soup = BeautifulSoup(page_content, 'html.parser')

    # Find the main milestones and information
    milestones = soup.find_all('span', class_='mw-headline')

    # Create a list to store the milestone texts
    milestone_texts = []

    # Loop through the milestones and extract the texts
    for milestone in milestones:
        milestone_texts.append(milestone.text)

    # Create the HTML content for the dashboard
    html_content = '''
    <html>
    <head>
        <title>SpaceX Launchpad</title>
        <style>
            body {
                background-color: #2f2f2f;
                color: #ffffff;
                font-family: Arial, sans-serif;
            }
            .container {
                max-width: 800px;
                margin: 40px auto;
                padding: 20px;
                background-color: #4f4f4f;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            }
            .milestone {
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>SpaceX Launchpad</h1>
            <ul>
    '''

    # Loop through the milestone texts and add them to the HTML content
    for milestone in milestone_texts:
        html_content += '<li class="milestone">' + milestone + '</li>'

    # Close the HTML tags
    html_content += '''
            </ul>
        </div>
    </body>
    </html>
    '''

    # Save the HTML content to a file
    desktop = os.path.join(os.path.expanduser('~'), 'Desktop')
    with open(os.path.join(desktop, 'SpaceX_Launchpad.html'), 'w') as file:
        file.write(html_content)

    # Open the file in the default browser
    import webbrowser
    webbrowser.open(os.path.join(desktop, 'SpaceX_Launchpad.html'))

