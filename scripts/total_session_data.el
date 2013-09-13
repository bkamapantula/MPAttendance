(setq lexical-binding t)

(require 'pcsv)

(let ((assoc-array ()))
  (mapcar (lambda (file-name)
	    (mapc (lambda (parsed-line)
		    (let ((mp-id (car parsed-line)))
		      (if (equal (assoc `,mp-id assoc-array) nil)
		    	  (add-to-list 'assoc-array `(,mp-id (0 0) ,parsed-line)))
		      (let* ((attendance (nth 1 (assoc `,mp-id assoc-array)))
		      	     (updated-attendance (list (+ (string-to-number (nth 2 parsed-line)) (nth 0 attendance))
						       (+ (string-to-number (nth 3 parsed-line)) (nth 1 attendance)))))
		      	(setq assoc-array (delete (assoc `,mp-id assoc-array) assoc-array))
			(add-to-list 'assoc-array `(,mp-id ,updated-attendance ,parsed-line)))))
		  (with-temp-buffer
		    (insert-file-contents file-name)
		    (next-line)
		    (let ((start-point (point))
			  (end-point (point-max)))
		      (pcsv-parse-region start-point end-point)))))
	  (directory-files "." nil ".*?\.csv"))
  (with-temp-buffer
    (insert "Id,Name,DaysSigned,DaysMissed,Gender,State,Party,Constituency\n")
    (setq assoc-array
	  (sort assoc-array
		(lambda (a b)
		  (if (< (string-to-number (car (nth 2 a))) (string-to-number (car (nth 2 b))))
		      t
		    nil))))
    (mapc
     (lambda (array-row)
       (let ((new-attendance (nth 1 array-row))
	     (parsed-line (nth 2 array-row)))
	 (setcar (nthcdr 2 parsed-line) (number-to-string (nth 0 new-attendance)))
	 (setcar (nthcdr 3 parsed-line) (number-to-string (nth 1 new-attendance)))
	 (insert (mapconcat 'identity parsed-line ",") "\n")))
     assoc-array)
    (write-file "overall.csv")))
