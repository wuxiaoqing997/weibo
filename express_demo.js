// express_demo.js 文件
var fs = require('fs')

var express = require('express')
var bodyParser = require('body-parser')

var app = express()

var log = console.log.bind(console, '---log: ')

var blogList = []

// 配置静态文件目录
app.use(express.static('static_files'))

app.use(bodyParser.json())

var sendHtml = function(path, response) {
    var options = {
        encoding: 'utf-8'
    }
    fs.readFile(path, options, function(err, data){
        response.send(data)
    })
}

var sendJSON = function(response, data) {
    var r = JSON.stringify(data, null, 2)
    response.send(r)
}

// 用 get 定义一个给用户访问的网址
app.get('/', function(request, response) {
    var path = 'index.html'
    sendHtml(path, response)
})

app.get('/blog/all', function(request, response) {
    sendJSON(response, blogList)
})

var blogAdd = function(form) {
    if (blogList.length == 0) {
        form.id = 1
    } else {
        var lastblog = blogList[blogList.length-1]
        form.id = lastblog.id + 1
    }
    blogList.push(form)
    return form
}

var blogDelete = function(id) {
    id = Number(id)
    // 在 blogList 中找到 id 对应的数据, 删除掉
    var index = -1
    for (var i = 0; i < blogList.length; i++) {
        var t = blogList[i]
        if (t.id == id) {
            // 找到了
            index = i
            break
        }
    }
    
    // 判断 index 来查看是否找到了相应的数据
    if (index > -1) {
        // 找到了, 用 splice 函数删除
        var t = blogList.splice(index, 1)[0]
        log("ok")
        return t
    } else {
        // 没找到
        return {}
    }
}


app.post('/blog/add', function(request, response) {
    var form = request.body
    var blog = blogAdd(form)
    sendJSON(response, blog)
})

app.get('/blog/delete/:id', function(request, response) {
    var id = request.params.id
    var blog = blogDelete(id)
    sendJSON(response, blog)
})

var server = app.listen(8081, function () {
    console.log('server', arguments.length, arguments)
    var host = server.address().address
    var port = server.address().port

    console.log(`应用实例，访问地址为 http://${host}:${port}`)
})
