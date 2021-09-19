set term postscript eps ", 32" color
set size 2, 1
set output "accuracy.eps"
set xlabel "Epoch"
set ylabel "Accuracy"
set pointsize 1.5
set key off
set yrange [0:1.05]
set ytics 0, 0.2
set xrange [0.5:50.5]
set xtics 5, 5

plot "epochs.dat" using 1:2 with linespoints lt -1 lw 8 pt 7, 0.75 with lines lt -1 lw 10 lc rgb '#00ff00'