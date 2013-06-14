
BitCorps Virtual Machine
========================


BCVM is a basic virtual machine for Javascript built to manipulate arbitrary-precision integers at configurably slow speeds. The motivation is to offload computations onto the client-side seamlessly through Javascript without pegging the user's CPU.

The goal of this particular example is to break an RSA key through massively parallel distributed computation. If this script were included in a webpage *without* the explicity knowledge of the visitor, it could almost be called an exploit -- a popular enough page would clearly be able to make considerable use of the distributed computational power, even at the slowed-down speeds necessary to avoid user detection/frustration.




