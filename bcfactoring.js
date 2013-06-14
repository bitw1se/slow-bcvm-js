
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
var max_digits = 8;
var key_digits = make_digits((2663 * 19).toString(),max_digits);
var test_digits = make_digits("19",max_digits);

function start_bcfactoring(){
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
  var rndctr = 3*N + 13;
  var rndidx = 3*N + 14;

  var unrolled_iters = [];
  var gen_iters = [];
  var q = 3*N/4;
  for(var i = 0; i < q; i++){
    gen_iters = gen_iters.concat([
      {"op": "add", "args": [rndidx,one,rndidx]}
    ]);
  }
  for(var i = q; i < N; i++){
    gen_iters = gen_iters.concat([
      {"op": "rndi", "args": [rndidx,ten]},
      {"op": "add", "args": [rndidx,one,rndidx]},
      {"op": "dump"}
    ]); 
  }


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
	{"op": "set", "args": [zero,0]}].concat(gen_iters).concat([
	{"op": "set", "args": [loopi, 9 + gen_iters.length]},
	{"op": "set", "args": [ctr1,0]},
	{"op": "set", "args": [rndctr,3*N + 14]},
	{"op": "set", "args": [rndidx,0]},
	{"op": "set", "args": [memcond1,cond1]}].concat(unrolled_iters).concat([
	{"op": "lcmp", "args": [memcond1, nmem, zero, nmem]},
	{"op": "gtc", "args": [cond1, cond1, neg1]},
	{"op": "dump"},
	{"op": "ldxc", "args": [cond1,loopi]},
	{"op": "dump"}
  ]));

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
