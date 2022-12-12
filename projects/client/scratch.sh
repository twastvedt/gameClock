#!/bin/bash
# Scrabble Clock

	add=450
	max=1200
	start=460
	sub=1		#coordinate with the timeout on read command below

# Set up players and timers arrays

	players=()
	timers=()
	totals=()
	clear
	echo -e "Type each player's name, then press Enter, in the order of play."
	echo -e "After you have finished, press Enter again to begin."
	read;
	while [[ ${#REPLY} -ne 0 ]]
	do
		players+=(${REPLY})
		timers+=(${start})
		totals+=(0)
		read;
	done
	clear
	cur=0
	isPaused=false

# Next player function

	next_player () {
		timers[cur]=$(( ${timers[cur]} + ${add} ))
		timers[cur]=$(( ${timers[cur]}>max ? max : ${timers[cur]}))
		cur=$((${cur}+1))
		cur=$((${cur} % ${#players[@]}))
	}
	
# Action & display

	while true
	do	
		if $isPaused
		then	# No-one plays at the moment
			echo -e "\rGame is paused. Press 'p' again to resume."
			read -n1 input
			[[ $input = p ]] && isPaused=false
			clear
		else
			clear
			timers[cur]=$(( ${timers[cur]} - sub ))
			totals[cur]=$(( ${totals[cur]} + sub ))
		fi

		echo "It is ${players[${cur}]}'s turn."
		for index in "${!players[@]}"; do echo "${players[index]}: ${timers[index]}"; done
		echo -e "\r "
		echo -e "Press n once you announce a valid word."
		echo -e "You can press p to pause or e to exit the game."
		
		if (( ${timers[cur]} < 100 ));
		then
			((left = ${timers[cur]} / 10 ))
			echo
			echo -e "\t ONLY ${left} SECONDS LEFT!"
		fi
		
		if (( ${timers[cur]} < 1 ));
		then
			echo -e "\r "
			echo -e "\rYou have run out of time and forfeited your turn."
			echo -e "\rPress any key to start the next player's turn."
			read -n1 input
			next_player
		fi

		read -n1 -t 0.1 input
		case $input in
		e|E)	# Exit
			break
			;;
		p|P)	# Pause
			isPaused=true
			;;
		n|N)	# Next player
			echo -e "\r "
			echo -e "\rPlace your tiles, record your score, and draw new letters."
			echo -e "\rThen, press any key to move to the next player."
			read -n1 input
			next_player
			;;
		esac
	done
	
	clear
	echo -e "Total time used by each player (not counting playing tiles and recording score):"
	for index in "${!players[@]}"; do echo "${players[index]}: ${totals[index]}"; done
	echo
	echo -e "Time left at the end of the game:"
	for index in "${!players[@]}"; do echo "${players[index]}: ${timers[index]}"; done
	echo

