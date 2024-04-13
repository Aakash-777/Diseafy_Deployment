const search = () => {
    // Get the search term from the search box.
    const searchbox = document.getElementById("search-bar").value.toUpperCase();
  
    // Get the product list element.
    const storeitems = document.getElementById("symp-list");
  
    // Get all of the product elements.
    const product = document.querySelectorAll(".symptoms");
  
    // Get all of the product name elements.
    const pname = storeitems.getElementsByTagName("h2");
  
    // Iterate over the product name elements.
    for (var i = 0; i < pname.length; i++) {
      // Get the current product element.
      let match = product[i].getElementsByTagName("h2")[0];
  
      // If the product name matches the search term, display the product.
      if (match) {
        let textvalue = match.textContent || match.innerHTML
        if (textvalue.toUpperCase().indexOf(searchbox) > -1) {
          product[i].style.display = "";
        } else {
          product[i].style.display = "none";
        }
      }
    }
  }
  