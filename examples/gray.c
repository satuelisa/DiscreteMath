#include <stdio.h>
#include <stdlib.h>
#include <assert.h>

unsigned long int unrank(int i, int b) {
  unsigned long int x = 0;
  int j;  
  for (j = 0; j < b; j++) {
    if (((i + (1 << j)) / (1 << (j + 1))) % 2) {
	x ^= 1 << j;
      }
  }
  return x;
}
   
int rank(unsigned long int x, int b) {
  int j, i = 0, z = 0;
  for (j = b - 1; j >= 0; j--) {  
    if (x & (1 << j)) { 
      if (!z) {
	i |= (1 << j);
	z = 1;
      } else {
	z = 0;
      }
    } else if (z) {	
      i |= (1 << j);
    }
  }
  return i;
}

void gray(int b) {
  int i, j;
  unsigned long int x = 0;
  for (i = 0; i < (1 << b); i++) {
    for (j = 0; j < b; j++) {
      if ((i + (1 << j)) % (1 << (j + 1)) == 0) { 
	  x ^= (1 << j);
      }
    }
    assert(rank(x, b) == i);
    assert(unrank(i, b) == x);
    printf("%lu\t%d\n", x, i);
  }
}
  
int main(int argc, char** argv) {
  int b;
  if (argc > 1) {
    b = atoi(argv[1]);
  } else {
    b = 5;
  }
  gray(b);
  return 0;
}
		    
