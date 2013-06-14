

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

function vm_interpret(bcodes){
  program = bcodes;
  vm_init();
  inst_idx = 0;
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
      memory[res] = 0;
      while(!done){
        if(memory[n1add+i] > memory[n2add+i]){
          memory[res] = 1;
          done = true;
        } else if(memory[n1add+i] < memory[n2add+i]){
          memory[res] = -1;
          done = true;
        }
        i++;
        if(i >= digits){ done = true; } 
      }
    } else if(op == "lsubi"){
      var n1add = memory[inst["args"][0]];
      var n2add = memory[inst["args"][1]];
      var digits = memory[inst["args"][2]];
      var idx = memory[inst["args"][3]];
      memory[n1add + digits - idx - 1] = memory[n1add + digits - idx - 1] -  memory[n2add + digits - idx - 1];
      if(memory[n1add + digits - idx - 1] < 0){
        memory[n1add + digits - idx - 1] += 10;
        memory[n1add + digits - idx - 2] -= 1;
      } 
    }
  }
  inst_idx += 1;
  vm_schedule();
}
 
