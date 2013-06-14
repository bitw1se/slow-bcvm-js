

var memory = [];

var vm_mem_size = 256;

function vm_init(){
  memory = [];
  for(var i = 0; i < vm_mem_size; i += 1){
    memory.push(0);
  }
}

var program = undefined;
var inst_idx = -1; 
var vm_timeout = 1;
var end_cb = undefined;
function vm_interpret(bcodes,cb){
  program = bcodes;
  vm_init();
  inst_idx = 0;
  end_cb = cb;
  vm_schedule();
}
var vms_ctr = 0; 
function vm_schedule(){
  vms_ctr = (vms_ctr + 1) % 10000;
  if(vm_timeout > 0 && (vms_ctr % 16 == 0)){
  setTimeout("vm_next()",vm_timeout);
  } else { vm_next(); } 
}

function vm_dump(){
  $('#output').html(JSON.stringify(memory));
}

function vm_next(){
  if(inst_idx >= program.length){
    console.log("PROGRAM END");
    if(end_cb){ end_cb(memory); }
    return;
  } else {
    var inst = program[inst_idx];
    var op = inst["op"];
    if(op == "dump"){
      vm_dump();
    } else if(op == "set"){
      memory[inst["args"][0]] = inst["args"][1];
    } else if(op == "cmp"){
      memory[inst["args"][0]] = (memory[inst["args"][1]] == memory[inst["args"][2]]) ? 1 : 0;
    } else if(op == "ltc"){
      memory[inst["args"][0]] = (memory[inst["args"][1]] < memory[inst["args"][2]]) ? 1 : 0;
    } else if(op == "gtc"){
      memory[inst["args"][0]] = (memory[inst["args"][1]] > memory[inst["args"][2]]) ? 1 : 0;
    } else if(op == "add"){
      memory[inst["args"][0]] = (memory[inst["args"][1]] + memory[inst["args"][2]]);
    } else if(op == "adm10"){
      memory[inst["args"][0]] = ((memory[inst["args"][1]] + memory[inst["args"][2]]) % 10);
    } else if(op == "mod"){
      memory[inst["args"][0]] = (memory[inst["args"][1]] % memory[inst["args"][2]]);
    } else if(op == "sub"){
      memory[inst["args"][0]] = (memory[inst["args"][1]] - memory[inst["args"][2]]);
    } else if(op == "mul"){
      memory[inst["args"][0]] = (memory[inst["args"][1]] * memory[inst["args"][2]]);
    } else if(op == "mod"){
      memory[inst["args"][0]] = (memory[inst["args"][1]] % memory[inst["args"][2]]);
    } else if(op == "div"){
      memory[inst["args"][0]] = Math.floor(memory[inst["args"][1]] / memory[inst["args"][2]]);
    } else if(op == "memld"){
      var dat = eval(inst["args"][1]);
      var addr = inst["args"][0];
      if(dat){
        for(var i = 0; i < dat.length; i++){
          memory[addr + i] = dat[i];
        } 
      }
    } else if(op == "stxp"){
      memory[inst["args"][0]] = inst_idx;
    } else if(op == "rndi"){
      var x = Math.floor(Math.random() * memory[inst["args"][1]]);
      //console.log("Random: " + x.toString() + " (" + inst["args"][0].toString() + ")");
      memory[memory[inst["args"][0]]] = x;
    } else if(op == "ldxp"){
      inst_idx = memory[inst["args"][0]];
    } else if(op == "ldxc"){
      inst_idx = (memory[inst["args"][0]] != 0) ? memory[inst["args"][1]] : inst_idx; 
    } else if(op == "skip"){
      inst_idx += inst["args"][0]; 
    } else if(op == "print"){ 
      $('#output').html(inst["args"][0]);
    } else if(op == "mov"){
      memory[inst["args"][0]] = memory[inst["args"][1]];
    } else if(op == "lcmp"){
      var res = memory[inst["args"][0]];
      var n1add = memory[inst["args"][1]];
      var n2add = memory[inst["args"][2]];
      var digits = memory[inst["args"][3]];
      var done = false;
      var i = 0;
      memory[res] = lcmp(n1add,n2add,digits);
      /*while(!done){
        if(memory[n1add+i] > memory[n2add+i]){
          memory[res] = 1;
          done = true;
        } else if(memory[n1add+i] < memory[n2add+i]){
          memory[res] = -1;
          done = true;
        }
        i++;
        if(i >= digits){ done = true; } 
      }*/
    } else if(op == "lsubi"){
      var n1add = memory[inst["args"][0]];
      var n2add = memory[inst["args"][1]];
      var digits = memory[inst["args"][2]];
      var idx = memory[inst["args"][3]];
      memory[n1add + digits - idx - 1] = memory[n1add + digits - idx - 1] -  memory[n2add + digits - idx - 1];
      if(memory[n1add + digits - idx - 1] < 0  && (idx < (digits - 1))){
        memory[n1add + digits - idx - 1] += 10;
        memory[n1add + digits - idx - 2] -= 1;
      } 
    }
  }
  inst_idx += 1;
  vm_schedule();
}

function lcmp(n1add,n2add,digits){
      var i = 0;
      var res = 0;
      var done = false;
      while(!done){
        if(memory[n1add+i] > memory[n2add+i]){
          res = 1;
          done = true;
        } else if(memory[n1add+i] < memory[n2add+i]){
          res = -1;
          done = true;
        }
        i++;
        if(i >= digits){ done = true; } 
      }
      return res;
}
 
