import requests  
from bs4 import BeautifulSoup  
import re  
from openpyxl import Workbook
def extract_info(html_content):  
    # 提取href和title  
    match_href_title = re.search(r'<a href="([^"]*)" target="_blank" title="([^"]*)">', html_content)  
    if match_href_title:  
        href_content = match_href_title.group(1)  
        title_content = match_href_title.group(2)  
    else:  
        href_content, title_content = '', ''  
  
    # 提取span5里面的内容  
    match_span5 = re.search(r'<li class="span5">([^<]*)</li>', html_content)  
    if match_span5:  
        span5_content = match_span5.group(1)  
    else:  
        span5_content = ''  
  
    # 提取时间  
    match_time = re.search(r'<li class="span3">([^<]*)</li>', html_content)  
    if match_time:  
        time_content = match_time.group(1)  
    else:  
        time_content = ''  
  
    return href_content, title_content, span5_content, time_content

wb = Workbook()
ws = wb.active
for i in range(1, 5):
    url = "https://jxdxsjy.jx.edu.cn/nchu/teachin/index/doma/nchu/domain/nchu/page/" + str(i)
    response = requests.get(url)  
    print(i)
    # 确保请求成功  
    if response.status_code == 200:  
    # 使用BeautifulSoup解析HTML  
        soup = BeautifulSoup(response.text, 'html.parser')  
    
  
    # 查找<ul class="infoList teachinList">  
        ul_tag = soup.findAll('ul', class_=['infoList', 'teachinList'])  

    # 如果没有找到，则打印信息并退出  
        if not ul_tag:  
            print("未找到指定的<ul>标签")  
            exit()  

        for item in ul_tag:
            res = extract_info(str(item))
        # print(res)
            ws.append(res)

    else:  
        print("请求失败，状态码:", response.status_code)

wb.save("output.xlsx")


# Liao 