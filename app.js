const express = require('express')
const app = express()
const port = 3001

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded())

global.orders=[]

let states=[]
states.push("ordered")
states.push("cooked")
states.push("served")
states.push("paid")

app.post('/PlaceOrder', (req, res) => {

    order={}
    order.state= "ordered"  
    order.tableNumber = req.body["tableNumber"]
    delete req.body.tableNumber
    order.items = req.body
    order.number = global.orders.length+1   //Note, the order number is 1 more than the orders index in the array (becuase we don't want an order #0)
    global.orders.push (order)  
    res.send('<html><body>Order Accepted #' + order.number + "</body></html>")

})

app.get('/view', (req, res) => {
    outputOrders(req,res)  
  })

app.get('/setState',(req, res) => {
    setOrderState(req,res)  
    outputOrders(req, res)
  })

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

path=require("path")
app.use(express.static(path.join(__dirname, 'public')));

function outputOrders(req,res){
    let filter=req.query["filter"]
    let ordersHTML=[]
    ordersHTML.push("<html><head><link type='text/css' rel='stylesheet' href='/css/style.css'></head><body>")
    ordersHTML.push('<table>')
    for (const order of global.orders){
      if (filter==null || order.state==filter){
        ordersHTML.push(orderHTML(order))    
      }
    }
    ordersHTML.push('</table>')
    ordersHTML.push('</body></html>')
    res.send(ordersHTML.join(''))
  }

function orderHTML(order){  
    let elements=[]
    elements.push("<tr>")
    elements.push("<td>Order#" + order.number + "</td>")
    elements.push("<td>Table#" + order.tableNumber + "</td>")
    elements.push("<td>")
    for (const key in order.items){
      quantity=order.items[key]
      if (quantity>0){
        elements.push( quantity + " * " + key + "<br>" )
      }
    }
    elements.push("</td>")
    elements.push("<td>" + order.state + "</td>")  
    elements.push("<td>" + stateButtons(order) + "</td>")
    elements.push("</tr>")
    console.log (order);
    return (elements.join(""))
  }

function stateButtons(order){
    let buttons=[]
    for(const state of states){
      buttons.push('<a href=/setState?orderNumber=' + order.number + '&state=' + state +'><th><button>Mark as ' + state + ' </button></th></a>')
    }
    return (buttons.join(' '))
  }

  function setOrderState(req,res){
    //transition state - based on a ?state=ordernum NameValue pair
    let order = global.orders[parseInt(req.query["orderNumber"])-1]
    order.state=req.query["state"]
}