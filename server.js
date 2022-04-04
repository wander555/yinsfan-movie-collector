const express = require('express');
const app = express();
const port = 6501;
const showResData = (msg, data = []) => {
    return {
        code: 200,
        msg,
        data
    }
};

// API异常处理
const ApiException = (message, errorCode = 999, status = 500) => {
    throw JSON.stringify({
        errorCode,
        message,
        status
    });
};

// 全局返回头
app.all('*', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    next();
});


// 全局报错处理
app.use((err, req, res, next) => {
    err = JSON.parse(err);
    res.status(err.status || 500);
    res.json(err);
});



//音丝饭
app.get('/getMovies', async (req, res, next) => {
    const handle = new require('./lib/Movie');
    let data = await new handle().getData();        
    res.send(showResData('获取成功', data));
});

// 豆瓣详情
app.get('/getMovieDetail/:id', async (req, res, next) => {
    const handle = new require('./lib/Movie');
    let { id } = req.params;
    let data = await new handle().getMovieDetail(id);
    res.send(showResData('获取成功', data));
});


app.listen(port, () => {
    console.log(`douban app listening on port ${port}`)
});