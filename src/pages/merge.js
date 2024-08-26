/**
 * 
 * @param {*} str html table字符串
 * @param {*} n 合并n列
 * @returns 
 */
function merge(str, n) {
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
  // 遍历二维数组，根据内容修改rowSpan和colSpan
  for (let row = 0; row < tableArray.length; row++) {
    // for (let col = 0; col < tableArray[row].length; col++) {
      for (let col = 0; col < tableArray[row].length && col < n; col++) {
      const cell = tableArray[row][col];
      if (cell.rowSpan === 0 || cell.colSpan === 0) continue; // 跳过已经被合并的单元格
      // 检查右侧相邻单元格内容是否相同
      let nextCol = col + 1;
      while (nextCol < tableArray[row].length && 
        nextCol < n && 
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

export default merge