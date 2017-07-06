var log = console.log.bind(console, '*** ')
var e = function(sel) {
    return document.querySelector(sel)
}
var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

var appendHtml = (element, html) => element.insertAdjacentHTML('beforeend', html)
var ajax = function(method, path, data, reseponseCallback) {
    var r = new XMLHttpRequest()
        // 设置请求方法和请求地址
    r.open(method, path, true)
        // 设置发送的数据的格式
    r.setRequestHeader('Content-Type', 'application/json')
        // 注册响应函数
    r.onreadystatechange = function() {
            if (r.readyState === 4) {
                // reseponseCallback 服务器返回的信息
                reseponseCallback(r.response)
            }
        }
        // 处理 data
    data = JSON.stringify(data, null, 2)
        // 发送请求
    r.send(data)
}

var templateblog = blog => {
    var author = blog.author
    var task = blog.task
    var id = blog.id
    var src = blog.src
    var time = blog.time
    var t = `
      <div class="contain" date-id="${id}">
                <img src="/img/${src}">
                <div class="context" >
                    <div class="user">@${author}：${task}</div>
                    <div class="time">${time}</div>
                </div>
                <li><a href="javascript:0" class="del">删除</a></li>
            </div>
    `

    return t
}
var contain = e('#footer')
var insertblog = blog => {
    var html = templateblog(blog)
    log(blog)
    appendHtml(contain, html)
}

var insertblogs = blogs => {
    log(blogs.length)
    log(typeof blogs)
    var list = JSON.parse(blogs)
    for (var i = 0; i < list.length; i++) {
        var blog = list[i]
        insertblog(blog)
    }
}
var apiblogAll = callback => {
    var method = 'GET'
    var path = '/blog/all'
    var data = {}
    ajax(method, path, data, callback)
}

var apiblogAdd = (blog, callback) => {
    var method = 'POST'
    var path = '/blog/add'
    var data = {
        author: blog.author,
        task: blog.task,
        src: blog.src,
        time: blog.time,
    }
    ajax(method, path, data, callback)
}

var apiblogDelete = (id, callback) => {
    var method = 'GET'
    var path = '/blog/delete/' + id
    var data = {}
    ajax(method, path, data, callback)
}

var getImg = function() {
    var total = e("#pic")
    var picList = total.children('li').children('a').children('img')
    picList.addEventListener('click', function(event) {
        var self = event.target
        src = self.dataset.src

        return src
    })
}

var getTime = function() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
    return currentdate;
}

var InsertDate = function() {
    var yes = e('#ok')
    yes.addEventListener('click', function() {
        var insert = e('#content').value
        log(insert.length)
        if (insert.length == 0) {
            alert("please enter!")
            e('textarea').focus()
        } else {
            var getsrc = getImg()
            log(getsrc)
            var gettime = getTime()
            var getauthor = e('#name').value()
            var data = {
                author: getauthor,
                task: gettask,
                src: getsrc,
                time: gettime,
                task:insert
            }
            apiTodoAdd(data, function(data) {
                log(data)
            })
            e('#content').value = ' '
            apiTodoAll(function(data) {
                log(data)
                var list = JSON.parse(data)
                var len = list.length
                insertTodo(list[len - 1])
            })
        }
    })
}

var focus = function(){
    var num = e('#content')
    num.addEventListener('focus',function(){
        var len = 140 - num.length
        var tip = e('#tips')
        tips.value='你还可以输入<b>'${len}'</b>个字'
    })
}

var bindEventDelete = () => {
    contain.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('del')) {
            log('button click, delete')
            var self = event.target
            var blogCell = self.closest('.contain')
                // 拿到 blog_id
                // 在事件中调用删除函数, 获取 blog_id 并且传给删除函数
                // 用 ajax 发送给服务器
            var blogId = blogCell.dataset.id
            apiblogDelete(blogId, function(blog) {
                log('删除成功', blog)
                    // 删除后, 删除页面元素
                blogCell.remove()
            })
        }
    })
}

var __main = function() {
    apiblogAll(function(data) {
        log(data)
        insertblogs(data)
    })
    InsertDate()
    bindEventDelete()
    focus()
}

__main()
