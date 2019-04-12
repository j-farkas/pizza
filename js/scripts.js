var pizzas = [];
var bank = new Bank();
function Bank(){
  this.money = 0;
}

function Pizza(size, toppings) {
  this.size = size;
  this.addToppings(toppings);
}

function Size(name, price) {
  this.name = name;
  this.price = price;
}

Pizza.prototype.addToppings = function(toppings) {
  var toPizza = [];
  toppings.forEach(function(top){
    toPizza.push(top);
  })
  this.toppings = toPizza;
}

function Toppings(name, price){
  this.name = name;
  this.price = price;
}

Pizza.prototype.getPrice = function(){
  price = parseInt(this.size.price);
  this.toppings.forEach(function(top){
    price += (parseInt(top.price)/100);
  })
  return price.toFixed(2);
}

function displayPizzas() {
  var pizzaList = $("ul#pizza-list");
  var htmlForPizzaInfo = "";
  for(var i=0;i<pizzas.length;i++){
    htmlForPizzaInfo += "<li id=" + i + ">" + pizzas[i].size.name + " " + pizzas[i].toppings.length + " topping pizza</li>";
  };
  pizzaList.html(htmlForPizzaInfo);
};

function showPizza(ind) {
  $("#pizza-details").show();
  $(".size").html(pizzas[ind].size.name);
  var topString = "";
  pizzas[ind].toppings.forEach(function(top){
    topString += top.name + ", ";
  })
  topString=topString.slice(0,toString.length-2);
  $(".toppings").html(topString);
  $(".price").html(pizzas[ind].getPrice());
  $("#buttons").empty();
  $("#buttons").append("<button class='removePizza' id=" + ind + ">Pizza Delivered</button>");
}

function removePizza(ind){
  pizzas.splice(ind,1);
}



function attachPizzaListeners() {
  $("ul#pizza-list").on("click", "li", function() {
    showPizza(this.id);
  });
  $("#buttons").on("click", ".removePizza", function() {
    bank.money += parseFloat(pizzas[this.id].getPrice());
    $('.cash').html(bank.money);
    removePizza(this.id);
    $("#pizza-details").hide();
    displayPizzas();
  });
};

$(document).ready(function() {
  attachPizzaListeners();
  $("form#new-pizza").submit(function(event) {
    event.preventDefault();
    var size = new Size($("#size option:selected").text(),$("#size").val());
    var tops = [];
    $("input:checkbox[name=add-toppings]:checked").each(function(){
       tops.push(new Toppings(this.value,$(this).attr('class')));
    });
    $("input:checkbox[name=add-toppings]:checked").prop('checked', false);
    pizzas.push(new Pizza(size, tops));
    $(".default").prop("checked", true);
    displayPizzas();
    console.log(pizzas);
  })
})
