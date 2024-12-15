const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback(...args);
      }, wait);
    };
  }


const renderBookRow = (title, available, additional, index, price) =>
  `<div class="${index % 2 ? 'dark-book-row' : ''} border-color-white border-b-2 w-full flex flex-row" title="${additional || title}"><div class="flex-1 px-2 flex items-center"><h1>${title}</h1></div><div class="py-2 px-2 mr-16"><p>${
    (available === 1) ? "✅可购买" : (!available ? "❌已售出" : "🚧暂不卖")
  }</p><p>${price} SGD</p><p>${additional}</p></div></div>`;

const search = (keyword, fullData) => {
    if(!keyword){
        return fullData;
    }
    return fullData.filter((item) => item.title.indexOf(keyword) >= 0);
}

const renderBookList = debounce((data) => {
    if(!data.length){
        document.getElementById('book-list').innerHTML = `<h1 class="mt-8 text-center">未找到匹配结果</h1>`
    }else{
      console.log(data)
        const list = data.map((data, index) => renderBookRow(data.title, data.available, data.language || '', index, data.price))
        document.getElementById('book-list').innerHTML = list.join('');
    }
}, 300);


const main = async () => {
    const inputRawData = await (await fetch('./books.csv')).text();
    const parsedCsv = inputRawData.split('\n').map((rawRow) => {
        const rowData = rawRow.split(',');
        return {
            title: rowData[0],
            available: Number(rowData[1]),
            language:  rowData[2],
            price: Number(rowData[3] || '2')
        }
    })
    renderBookList(parsedCsv);

    document.getElementById('search-input').addEventListener('input',  (e)=>{
        renderBookList(search(e.currentTarget.value, parsedCsv));
    })
}

main();