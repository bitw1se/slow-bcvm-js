
var hostUrl = "";

function make_digits(s,n){
  var arr = [];
  for(var i = 0; i < (n - s.length); i++){
    arr.push(0);
  }
  for(var i = 0; i < s.length; i++){
    arr.push(parseInt(s.substring(i,i+1)));
  }
  return arr; 
}

var fermatIters = 3;
var timeout = 1000;
var target_digits = [1,2,5,1];
var max_digits = 19;
//var key_digits = [0,6,4,2,3,5,5,2,3];
//var test_digits = [0,0,0,1,3,5,1,2,1];
var key_digits = make_digits((2663 * 19).toString(),max_digits);
var test_digits = make_digits("19",max_digits);

function start_bcfactoring(){
//  var tst = [{"opcode": "set", "args": [0,2]}, {"opcode": "set", "args": [4,6]}, {"opcode":"dump"}, {"opcode": "set", "args": [1,3]},{"opcode":"mul","args":[3,0,1]}, {"opcode":"dump"},{"opcode": "cmp", "args": [2,3,4]}, {"opcode":"dump"}];
  var tst1 = [
	{"op": "memld", "args": [0, "target_digits"]},{"op":"dump"},
	// multiply pieces
	{"op": "mul", "args": [6, 3, 0]}, 
	{"op": "mul", "args": [7, 3, 1]}, 
	{"op": "mul", "args": [8, 2, 0]}, 
	{"op": "mul", "args": [9, 2, 1]}, 
	// sum number 
	{"op": "add", "args": [12, 5, 8]}, 
	{"op": "add", "args": [13, 6, 9]}, 
	{"op": "add", "args": [14, 7, 10]}, 
	// setup constants 
	{"op": "set", "args": [30, 10]}, 
	{"op": "set", "args": [29, 6]}, 
	{"op": "set", "args": [28, 10]}, 
	// carry iter 
	{"op": "ltc", "args": [18, 13, 30]}, 
	{"op": "stxp", "args": [31]},
        {"op": "add", "args": [31, 31, 29]},
        {"op": "ldxc", "args": [18, 31]},
        {"op": "mod", "args": [19, 13, 28]}, 
        {"op": "div", "args": [20, 13, 28]}, 
        {"op": "mov", "args": [13, 19]}, 
        {"op": "add", "args": [12, 12, 20]}, 
	{"op": "dump"} 
  ];
  /*

 Address space:
  0 - N    ->  possible factor
  N - 2N   ->  key 
  2N - 3N  ->  temp space 
  3N - ?   ->  constants 

   */
  var N = max_digits;
  var neg1 = 3*N + 2;
  var four = 3*N + 4;
  var one = 3*N + 6;
  var ten = 3*N + 5;
  var nmem = 3*N + 7;
  var zero = 3*N + 8;
  var ctr1 = 3*N + 9;
  var loopi = 3*N + 10;
  var cond1 = 3*N + 11;
  var memcond1 = 3*N + 12;
  var unrolled_iters = [];
  for(var i = 0; i < N; i++){
    unrolled_iters = unrolled_iters.concat([
	{"op": "lsubi", "args": [nmem, zero, nmem, ctr1]},
	{"op": "add", "args": [ctr1, one, ctr1]} ]);
  }
  var mod_test = [
	{"op": "memld", "args": [max_digits, "key_digits"]},
	{"op": "memld", "args": [0, "test_digits"]},
	{"op": "dump"},
	{"op": "set", "args": [four, 4]},
	{"op": "set", "args": [nmem, N]},
	{"op": "set", "args": [one, 1]},
	{"op": "set", "args": [ten, 10]},
	{"op": "set", "args": [neg1, -1]},
	{"op": "set", "args": [zero,0]},
	{"op": "set", "args": [loopi,9]},
	{"op": "set", "args": [ctr1,0]},
	{"op": "set", "args": [memcond1,cond1]}].concat(unrolled_iters).concat([
	{"op": "lcmp", "args": [memcond1, nmem, zero, nmem]},
	{"op": "gtc", "args": [cond1, cond1, neg1]},
	{"op": "dump"},
	{"op": "ldxc", "args": [cond1,loopi]},
	{"op": "dump"}
  ]);

  var cb = function(mem){
    if(!is_answer(mem)){
      vm_interpret(mod_test,cb);
    } else {
     alert("Cracked the code: " + JSON.stringify(mem));
    }
  };
  vm_interpret(mod_test,cb);
}

function is_answer(mem){
  var ans = true;
  for(var i = 0; i < max_digits; i++){
    if(mem[max_digits+i] != 0){
      ans = false;
      break;
    }
  }
  return ans;
}
