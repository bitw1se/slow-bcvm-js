
BitCorps Virtual Machine
========================

Is it possible to use Javascript to harness tiny bits of processing power in parallel across all the viewers of your web page?

Yes. BCVM demonstrates how this can be done. The main issue is that neither Javascript nor web browsers were intended to be used for computation -- any significant computation will cause visible symptoms that would distress any user and in many cases compromise the stability of their computer. In order to avoid taking *too* much power, BCVM purposefully throttles its own computation. In our example, we show how this kind of script could be use to harness parallel processing power for the purpose of breaking RSA encryption keys. (Breaking an RSA key comes down to factoring a large integer into two primes. There is no known efficient algorithm to do this.) 

To try it out, [view the demo](http://htmlpreview.github.io/?https://github.com/bitw1se/slow-bcvm-js/blob/master/index.html).

BCVM is a basic virtual machine for Javascript built to manipulate arbitrary-precision integers at configurably slow speeds. The motivation is to offload computations onto the client-side seamlessly through Javascript without pegging the user's CPU.

The goal of this particular example is to break an RSA key through massively parallel distributed computation. If you were to use a bignum library in Javascript to try and break encryption keys, you would likely crash the client-side machine. BCVM runs bytecode slowly -- pausing for some amount of time every `n` cycles. This allows for execution of arbitrary code on the client-side without disrupting the user.

If this script were included in a webpage *without* the explicit knowledge of the visitor, it could almost be called an exploit -- a popular enough page would clearly be able to make considerable use of the distributed computational power, even at the slowed-down speeds necessary to avoid user detection/frustration. *Please do not use this script for any malicious purposes -- it is an interesting example only.*

### The basic overview

BCVM is an interesting example of a use case for virtual machines where the machine truly must be virtual. It's not a real VM meant to do anything real. So I made some substantial simplifications.

Like any VM, BCVM takes a program as a list of instructions. Each instruction is an opcode with associated argumentation, and does one simple, elementary operation -- adding two numbers, moving data from hither to thither, or a conditional branch, for example.

Unlike any VM, the memory space consists of an array of "cells", each of which contains a Javascript object (typically a number), but they could contain strings or even objects. And, there are no registers. The basic operations take memory addresses (indices in the array). Furthermore, many (most?) opcodes are missing. I put in the bare minimum to create the example app.

Finally, there are a couple special-usage opcodes -- `lsubi` does a single iteration of a subtraction on two base-10 arbitrary precision numbers, and `lcmp` compares two byte arrays storing base-10 arbitrary precision numbers. Since we don't have a language that compiles to BCVM bytecode, we'll need to write it by hand. These special opcodes make that process much, much simpler.  

### The algorithms

This algorithms I used are very naive. This is mostly for the sake of interestingness (sic) so I wanted it to be somewhat readable. The central idea is that if this website were distributed enough, the total parallel power could still be large, no matter how slow you run the algorithms.

At any rate, numbers are chosen randomly and tested to see if they divide the chosen "target key." Even numbers are rejected, considering 2 will not be a prime factor for an RSA key. Division is done by repeated subtraction. It would not be difficult to extend it to do the Fermat primality test and the Euclidean algorithm, which would greatly improve the (algorithmic) runtime. 

For an instance cracking a key of maximum length `N` decimal digits, the address space is sized `5 * N` to be safe. The first `N` are used for the guess at the factor, the second `N` are used for the state of the key (which is subject to mutation by repeated subtraction) and the last 15 or so store various "registers," constants, and indices.



