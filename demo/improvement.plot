set term postscript eps ", 32" color
set size 2, 1
set output "improvement.eps"
set xlabel "Iteration"
set ylabel "Cost"
set pointsize 1.5
set yrange [7:11]
set ytics 8, 2
set key off

plot "improvement.dat" using 2:1 with linespoints lt -1 lw 8 pt 7 lc rgb "#0000ff"