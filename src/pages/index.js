import React from 'react';
import {
  generateTable,
  generateHTMLTable,
  generateExcel,
  parseDataToSchema
} from 'json5-to-table'
import parse from 'html-react-parser';
import "./index.less"
import merge from './merge';

const JSONTable = () => {

  function exportExcel() {
    console.log(mergedTableHTML);
    var template = `
    <html>
        <head>
            <meta charset="UTF-8">
        </head>
        <body>
            ${mergedTableHTML}
        </body>
    </html>`;
    var excelBlob = new Blob([template], { type: "application/vnd.ms-excel" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(excelBlob);
    link.download = "导出Excel.xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const data = [
    {
      A: [
        { a1: '价值创造', a2: '经济利润', a3: '经济利润1', a4: '经济利润2', a5: '阿帆', a6: 'dd' },
        { a1: 'admin', a2: 'admin', a3: 'mock', a4: 'li', a5: '辅导费', a6: 'observe' },
        { a1: 'user', a2: 'user', a3: 'user', a4: 'query', a5: 'observe', a6: '顶顶顶顶' },
        { a1: 'jjjjj', a2: 'jjjjj', a3: 'jjjjj', a4: 'jjjjj', a5: 'kkk的', a6: '王五 ' },
        { a1: 'kkkk', a2: 'kkkk', a3: 'kkkk', a4: 'kkkk', a5: 'kkkk', a6: '露露' },
        { a1: '张三', a2: '张三', a3: '张三', a4: '张三', a5: '张三', a6: '张三' },
        { a1: '张三', a2: 'fast', a3: '宿舍', a4: 'dd', a5: '好怀念', a6: '十三个'},
  
      ],
      C: [
        { c1: 'example', c2: 'happy' },
        { c1: 'example1', c2: 'happy' },
        { c1: 'example2', c2: 'happy' },
        { c1: 'example2', c2: 'happy' },
        { c1: 'example2', c2: 'happy' },
        { c1: 'example2', c2: 'happy' },
        { c1: 'example2', c2: 'happy' },
      ],
      danwei: [
        { danwei: 'ccc' },
        { danwei: 'ddd' },
        { danwei: '333' },
        { danwei: '333' },
        { danwei: '333' },
        { danwei: '333' },
        { danwei: '333' },
      ]
    },
   
  ]

const schema = [
  {
    path: 'A', props: [
      { path: 'a1' },
      { path: 'a2' },
      { path: 'a3' },
      { path: 'a4' },
      { path: 'a5' },
      { path: 'a6' },
    ]
  },
  {
    path: 'C', props: [
      { path: 'c1' },
      { path: 'c2' }
    ]
  },
  {
    path: 'danwei', props: [{
      path: 'danwei'
    }]
  }
]

const htmlString = generateHTMLTable(data, schema);


let mergedTableHTML = merge(htmlString, 3);
//自定义表格样式
mergedTableHTML = mergedTableHTML.replace(/<table>[\s\S]*<thead>/g, `<table border-collapse="collapse" width="100%" border="1px solid #c6c6c6" margin-bottom="20px" >
<thead style="background-color: #ddeeff">
`)



return (
  <div>
    <button type="button" onClick={exportExcel}>导出Excel</button>
    {parse(mergedTableHTML)}
  </div>
);

};

export default JSONTable;