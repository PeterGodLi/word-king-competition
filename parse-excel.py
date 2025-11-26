#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Excel单词数据解析脚本
用于将Excel文件中的单词数据转换为JSON格式
"""

import pandas as pd
import json
import sys

def parse_excel_to_json(excel_file, output_file='words.json'):
    """
    解析Excel文件并转换为JSON格式
    
    参数:
        excel_file: Excel文件路径
        output_file: 输出JSON文件路径
    """
    try:
        # 读取Excel文件
        print(f"正在读取文件: {excel_file}")
        df = pd.read_excel(excel_file)
        
        # 显示列名
        print(f"Excel列名: {list(df.columns)}")
        print(f"总共 {len(df)} 行数据")
        
        # 初始化单词数据库
        word_database = {}
        
        # 遍历每一行数据
        for index, row in df.iterrows():
            # 根据实际的Excel列名调整这里的字段
            # 假设Excel有以下列: 话题/分类, 单词, 音标, 中文释义, 例句
            category = str(row.get('话题', row.get('分类', '未分类'))).strip()
            word = str(row.get('单词', row.get('Word', ''))).strip()
            phonetic = str(row.get('音标', row.get('Phonetic', ''))).strip()
            translation = str(row.get('中文', row.get('中文释义', row.get('Translation', '')))).strip()
            example = str(row.get('例句', row.get('Example', ''))).strip()
            
            # 跳过空行
            if not word or word == 'nan':
                continue
            
            # 处理音标格式
            if phonetic and phonetic != 'nan':
                if not phonetic.startswith('/'):
                    phonetic = f"/{phonetic}/"
            else:
                phonetic = ""
            
            # 处理例句
            if not example or example == 'nan':
                example = ""
            
            # 如果分类不存在，创建新分类
            if category not in word_database:
                word_database[category] = []
            
            # 添加单词数据
            word_data = {
                'word': word,
                'phonetic': phonetic,
                'translation': translation,
                'example': example
            }
            
            word_database[category].append(word_data)
        
        # 保存为JSON文件
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(word_database, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ 成功解析！")
        print(f"话题分类数量: {len(word_database)}")
        for category, words in word_database.items():
            print(f"  - {category}: {len(words)} 个单词")
        print(f"\n输出文件: {output_file}")
        
        # 生成JavaScript格式的数据
        js_output = output_file.replace('.json', '.js')
        with open(js_output, 'w', encoding='utf-8') as f:
            f.write("// 自动生成的单词数据库\n")
            f.write("const WordDatabase = ")
            f.write(json.dumps(word_database, ensure_ascii=False, indent=2))
            f.write(";\n\n")
            f.write("// 如果在浏览器环境中，导出到全局变量\n")
            f.write("if (typeof window !== 'undefined') {\n")
            f.write("    window.WordDatabase = WordDatabase;\n")
            f.write("}\n")
        
        print(f"JavaScript文件: {js_output}")
        
        return word_database
        
    except FileNotFoundError:
        print(f"❌ 错误: 找不到文件 '{excel_file}'")
        return None
    except Exception as e:
        print(f"❌ 解析错误: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def show_excel_info(excel_file):
    """显示Excel文件的基本信息"""
    try:
        df = pd.read_excel(excel_file)
        print(f"\n📊 Excel文件信息:")
        print(f"行数: {len(df)}")
        print(f"列数: {len(df.columns)}")
        print(f"\n列名:")
        for i, col in enumerate(df.columns, 1):
            print(f"  {i}. {col}")
        print(f"\n前5行数据:")
        print(df.head())
    except Exception as e:
        print(f"❌ 读取错误: {str(e)}")

if __name__ == '__main__':
    # 默认文件名
    excel_file = '话题分类-新课标1600词词表.xlsx'
    
    # 如果命令行提供了文件名，使用命令行参数
    if len(sys.argv) > 1:
        excel_file = sys.argv[1]
    
    print("=" * 60)
    print("单词数据解析工具")
    print("=" * 60)
    
    # 先显示Excel信息
    show_excel_info(excel_file)
    
    print("\n" + "=" * 60)
    print("开始解析...")
    print("=" * 60)
    
    # 解析Excel文件
    parse_excel_to_json(excel_file)
