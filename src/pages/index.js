import React from 'react';
import {
  generateTable,
  generateHTMLTable,
  generateExcel,
  parseDataToSchema
} from 'json5-to-table'
import parse from 'html-react-parser';
import "./index.less"

const JSONTable = () => {

  function mergeTableCells(htmlString) {
    // 解析HTML字符串为DOM对象
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const table = doc.querySelector('table');
    const rows = table.querySelectorAll('tbody tr');

    // 遍历每一行
    rows.forEach(row => {
      let previousCell = null;
      let count = 1;

      // 从右向左遍历单元格
      for (let i = row.cells.length - 1; i >= 0; i--) {
        const cell = row.cells[i];

        if (previousCell && cell.textContent === previousCell.textContent) {
          count++;
          row.deleteCell(i);  // 删除重复单元格
          previousCell.colSpan = count;  // 更新前一个单元格的colSpan
        } else {
          count = 1;
          previousCell = cell;
        }
      }
    });

    // 将DOM对象重新转回HTML字符串
    return table.outerHTML;
  }

  function exportExcel(id) {
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
      { a1: '价值创造', a2: '经济利润', a3: '经济利润', a4: '经济利润' },
      { a1: '价值创造', a2: '阿阿阿', a3: '阿阿阿', a4: '阿阿阿' },
      { a1: '价值创造', a2: 'same content', a3: 'same content', a4: 'same content' },

    ],
    C: [
      { c1: 'example', c2: 'happy' },
      { c1: 'example1', c2: 'happy' },
      { c1: 'example2', c2: 'happy' },
    ],
    Ogz: [
      { Ogz: 'ccc' },
      { Ogz: 'ddd' },
      { Ogz: '333' },
    ]
  },
  {
    A: [
      { a1: 'aaaaaaa', a2: 'bbbbb', a3: 'bbbb', a4: 'bbbb' },
      { a1: 'aaaaaaa', a2: 'ccccccc', a3: 'b', a4: 'b' },
      { a1: 'aaaaaaa', a2: 'ccccccc', a3: 'bb', a4: 'bb' },
    ],
    C: [
      { c1: 'abc', c2: 'abcd' },
      { c1: 'abc', c2: 'hij' },
      { c1: 'abc', c2: 'hij' },
    ],
    Ogz: [
      "ccc", 'ddd', 'eee'
    ]
  }
]

const schema = [
  {
    path: 'A', props: [
      { path: 'a1' },
      { path: 'a2' },
      { path: 'a3' },
      { path: 'a4' },
    ]
  },
  {
    path: 'C', props: [
      { path: 'c1' },
      { path: 'c2' }
    ]
  },
  {
    path: 'Ogz', props: [{
      path: 'Ogz'
    }]
  }
]

const htmlString = generateHTMLTable(data, schema);

function merge(str) {
  // 创建一个DOM解析器
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  const tbody = doc.querySelector('tbody');
  const rows = Array.from(tbody.rows);

  // 初始化二维数组，保存每个单元格的内容和合并信息
  const tableArray = rows.map(row =>
    Array.from(row.cells).map(cell => ({
      content: cell.textContent,
      rowSpan: 1,
      colSpan: 1
    }))
  );

  console.log(tableArray);
  // 遍历二维数组，根据内容修改rowSpan和colSpan
  for (let row = 0; row < tableArray.length; row++) {
    for (let col = 0; col < tableArray[row].length; col++) {
      const cell = tableArray[row][col];
      if (cell.rowSpan === 0 || cell.colSpan === 0) continue; // 跳过已经被合并的单元格

      // 检查右侧相邻单元格内容是否相同
      let nextCol = col + 1;
      while (nextCol < tableArray[row].length &&
        tableArray[row][nextCol].content === cell.content) {
        cell.colSpan++;
        tableArray[row][nextCol].colSpan = 0; // 将右侧单元格标记为已合并
        nextCol++;
      }

      // 检查下方相邻单元格内容是否相同
      let nextRow = row + 1;
      while (nextRow < tableArray.length &&
        tableArray[nextRow][col].content === cell.content) {
        // 确保整行的合并范围一致
        let isMergeable = true;
        for (let i = 0; i < cell.colSpan; i++) {
          if (tableArray[nextRow][col + i].content !== cell.content) {
            isMergeable = false;
            break;
          }
        }

        if (isMergeable) {
          cell.rowSpan++;
          for (let i = 0; i < cell.colSpan; i++) {
            tableArray[nextRow][col + i].rowSpan = 0; // 将下方单元格标记为已合并
          }
        } else {
          break;
        }
        nextRow++;
      }
    }
  }

  // 生成合并后的表格HTML字符串
  let result = '<table>\n  <thead>\n    ' + doc.querySelector('thead').innerHTML + '\n  </thead>\n  <tbody>\n';

  for (let row = 0; row < tableArray.length; row++) {
    result += '    <tr>\n';
    for (let col = 0; col < tableArray[row].length; col++) {
      const cell = tableArray[row][col];
      if (cell.rowSpan !== 0 && cell.colSpan !== 0) {
        result += `      <td${cell.rowSpan > 1 ? ` rowspan="${cell.rowSpan}"` : ''}${cell.colSpan > 1 ? ` colspan="${cell.colSpan}"` : ''}>${cell.content}</td>\n`;
      }
    }
    result += '    </tr>\n';
  }

  result += '  </tbody>\n</table>';
  return result;
}


let mergedTableHTML = merge(htmlString);

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