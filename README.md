# JsonToTable
一个将数据转化为表格的工具,自动合并内容相同的单元格,支持导出功能

![这是图片](./src/assets/1724311797223.jpg)

## 核心功能
1. 将横向或纵向内容相同的单元格合并,不会打乱顺序或错位 (注意: 作者不考虑既存在横向合并,又存在纵向合并的情况)
2. 表格导出,只有行内样式才能生效哦!

## 使用方法
````js
import merge from './merge';

// str是html table字符串; n 是合并的列数
// 输出合并之后的table字符串
const mergedTableHTML = merge(str, n)
````

希望能够帮助到你!