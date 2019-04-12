var pizzas = [];
var bank = new Bank();
function Bank(){
  this.money = 0,
  this.come = false,
  this.pass = false,
  this.firstRoll = false
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

function rollDice(){
  var rolls = [];
   rolls.push(Math.floor((Math.random())*6)+1);
   rolls.push(Math.floor((Math.random())*6)+1);
  return rolls;
}

function winner(){
  bank.money += 20;
  displayBank();
  $(".bet").show()
  bank.come = false;
  bank.pass = false;
  $('.point').hide();
  $('.dicepics').append("<h1>Winner!</h2>");
  $('.dice').hide();
}

function loser(){
  $(".bet").show()
  bank.come = false;
  bank.pass = false;
  $('.point').hide();
  $('.dicepics').append("<h1>Loser!</h1>");
  $('.dice').hide();
}
function displayBank(){
  $('.cash').html(bank.money.toFixed(2));
}
function attachPizzaListeners() {
  $("ul#pizza-list").on("click", "li", function() {
    showPizza(this.id);
  });
  $("#buttons").on("click", ".removePizza", function() {
    bank.money += parseFloat(pizzas[this.id].getPrice());
    displayBank();
    removePizza(this.id);
    $("#pizza-details").hide();
    displayPizzas();
  });
  $(".craps").on("click", ".dice", function() {
    if(bank.come !== false){
      var roll = rollDice();
      $('.dicepics').html("<img src=img/"+roll[0]+".png><img src=img/"+roll[1]+".png>");
      if(bank.firstRoll === true){
        if(roll[0]+roll[1] === 7 ||roll[0]+roll[1] === 11 ){
          if(bank.come === 'come'){
            winner();
          }else{
            loser();
          }
        }else if(roll[0]+roll[1] === 2 ||roll[0]+roll[1] === 12 ||roll[0]+roll[1] === 3 ){
          if(bank.come === 'dontcome'){
            winner();
          }else{
            loser();
          }
        }else{
          bank.point = roll[0]+roll[1];
          $('.point').show();
          $('.point').html("<h3>Point: "+bank.point+"</h3>");
        }
        bank.firstRoll = false;
      }else{
        if((roll[0]+roll[1])===bank.point){
          if(bank.come === "come"){
            winner();
          }else{
            loser();
          }
        }else if(roll[0]+roll[1]===7 || roll[0]+roll[1]===11){
          if(bank.come === "dontcome"){
            winner();
          }else{
            loser();
          }
        }
      }
    }
  });
  $(".bet").on("click", "button", function() {
    bank.come = $(this).attr('id');
    bank.firstRoll = true;
    bank.money -= 10;
    displayBank();
    $(".bet").hide();
    $(".dicepics").empty();
    $('.dice').show();
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
  })
})
