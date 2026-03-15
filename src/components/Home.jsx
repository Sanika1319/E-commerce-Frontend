import React from "react";

function Home() {

  const styles = {

    hero:{
      height:"70vh",
      background:"linear-gradient(135deg,#1f2937,#111827)",
      color:"white",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      flexDirection:"column",
      textAlign:"center",
      padding:"20px"
    },

    heroBtn:{
      marginTop:"20px",
      padding:"12px 30px",
      border:"none",
      borderRadius:"30px",
      background:"#f59e0b",
      fontWeight:"bold"
    },

    section:{
      padding:"70px 8%"
    },

    productCard:{
      border:"none",
      borderRadius:"12px",
      overflow:"hidden",
      boxShadow:"0 8px 20px rgba(0,0,0,0.1)",
      transition:"0.3s",
      cursor:"pointer"
    },

    productImg:{
      height:"220px",
      objectFit:"cover"
    },

    brandCard:{
      background:"#f8f9fa",
      padding:"25px",
      borderRadius:"10px",
      textAlign:"center",
      fontWeight:"600"
    },

    offerBanner:{
      background:"linear-gradient(135deg,#f59e0b,#ef4444)",
      color:"white",
      padding:"50px",
      textAlign:"center",
      borderRadius:"10px"
    }

  }

  return (

<div>

<style>
{`
.product-hover:hover{
transform:translateY(-8px);
box-shadow:0 15px 30px rgba(0,0,0,0.2);
}
`}
</style>


{/* HERO BANNER */}

<section style={styles.hero}>

<h1 className="display-4 fw-bold">
Discover Amazing Products
</h1>

<p className="lead mt-2">
Best deals on electronics, fashion and accessories
</p>

<button style={styles.heroBtn}>
Shop Now
</button>

</section>



{/* OFFER BANNER */}

<section style={styles.section} className="container">

<div style={styles.offerBanner}>
<h2 className="fw-bold">🔥 Mega Sale - Up To 50% Off</h2>
<p>Limited time offer on top products</p>
<button className="btn btn-light fw-bold">
Shop Now
</button>
</div>

</section>



{/* DEAL OF THE DAY */}

<section style={styles.section} className="bg-light">

<div className="container">

<h2 className="text-center fw-bold mb-5">
Deal of the Day
</h2>

<div className="row g-4">

{[1,2,3,4].map((item)=>(
<div className="col-md-3" key={item}>

<div className="card product-hover" style={styles.productCard}>

<img
src={`https://picsum.photos/300/200?random=${item}`}
className="card-img-top"
style={styles.productImg}
/>

<div className="card-body text-center">

<h5>Special Product</h5>

<p className="text-danger fw-bold">
₹1,999
</p>

<button className="btn btn-warning w-100">
Add to Cart
</button>

</div>

</div>

</div>
))}

</div>

</div>

</section>



{/* TOP BRANDS */}

<section style={styles.section} className="container">

<h2 className="text-center fw-bold mb-5">
Top Brands
</h2>

<div className="row g-4">

<div className="col-md-3">
<div style={styles.brandCard}>Apple</div>
</div>

<div className="col-md-3">
<div style={styles.brandCard}>Samsung</div>
</div>

<div className="col-md-3">
<div style={styles.brandCard}>Nike</div>
</div>

<div className="col-md-3">
<div style={styles.brandCard}>Adidas</div>
</div>

</div>

</section>



{/* TRENDING PRODUCTS */}

<section style={styles.section} className="bg-light">

<div className="container">

<h2 className="text-center fw-bold mb-5">
Trending Products
</h2>

<div className="row g-4">

{[5,6,7,8].map((item)=>(
<div className="col-md-3" key={item}>

<div className="card product-hover" style={styles.productCard}>

<img
src={`https://picsum.photos/300/200?random=${item}`}
className="card-img-top"
style={styles.productImg}
/>

<div className="card-body text-center">

<h5>Trending Product</h5>

<p className="text-muted">
₹2,499
</p>

<button className="btn btn-dark w-100">
Buy Now
</button>

</div>

</div>

</div>
))}

</div>

</div>

</section>



</div>

  )
}

export default Home