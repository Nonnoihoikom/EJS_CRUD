const express = require('express')
const app = express()
const port = 3000
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended:true }));

const products = [];
for (let i=1; i<=100; i++) {
   const product = {
      id: i,
      name: `Product ${i}`,
      price: (Math.random()*100).toFixed(2),
      description:`This is a description for product ${i}`
   };
   products.push(product)
}

console.log(products)

app.get("/products",(req,res) =>{
   const limit = parseInt(req.query.limit) || 10;
   const page = parseInt(req.query.page) || 1;


   const startIndex = (page - 1) * limit;
   const endIndex = page * limit;

   const paginatedProducts = products.slice(startIndex, endIndex);
   console.log(paginatedProducts)

   res.render("products",{paginatedProducts,limit,page})
}) 

app.get('/', (req, res) => {
   res.render('index')
})

app.get('/page2', (req, res) => {
   const name = req.query.name;
   const age = req.query.age;
   res.render('page2',{name,age})
})


app.get('/add-product', (req, res) => {
   res.render('add-product')
})

app.post('/add-product', (req, res) => {
   const {name, price, description} = req.body;
   const newProduct = {
      id : products.length + 1,
      name,
      price,
      description
   };
   products.push(newProduct)
   res.redirect('/products');
})

app.get("/edit-product/:id",(req, res) => {
   const id = parseInt(req.params.id);
   const product = products.find(p => p.id === id);
   if (!product) {
      return res.status(404).send("Product not found");
   }
   res.render("edit-product", { product });
} )

app.post('/edit-product', (req,res) => {
   const {id, name, price, description } = req.body;
   const productIndex = products.findIndex(p => p.id === parseInt(id));

   if (productIndex === -1) {
      return res.status(404).send('Product not found');
   }

   products[productIndex] = {id : parseInt(id), name, price, description};
   res.redirect('/products')
});

app.get('/delete-product/:id', (req,res) => {
   const id = parseInt(req.params.id);
   const productIndex = products.findIndex(p => p.id === id);

   if (productIndex === -1) {
      return res.status(404).send('Product not found');
   }

   products.splice(productIndex,1);
   res.redirect('/products');
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
