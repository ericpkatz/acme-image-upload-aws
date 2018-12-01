- no circular references

moe 1
  larry 2
    curly 3
  shep 4




the problem - what if larry's manager become curly?

curly works for larry and larry works for curly.
circular reference.

if we went to get larry's workers we would get curly and if we got curly's workers we would get larry and we have a cycle.

how to avoid?

for new users, it's a non issue-- a new user can go anywhere.

for editing - check the new manager and look at the managers hierarchy--- if you find yourself in the hierarchy, then you have a problem.

curly would be the new manager of larry. curly has a hierarchy of [3, 2, 1] and larry has an id of 2. So this would create a circular reference.

can shep go under curly? again curly has a hierarch of [3, 2, 1] and shep has id of 4. no circular reference.

can shep go under shep? Shep has a hierarchy of [4, 1] and shep has an id of 4-- circular.

Get hierarchy of new manager-- if I'm in it, then there is a circular reference!


