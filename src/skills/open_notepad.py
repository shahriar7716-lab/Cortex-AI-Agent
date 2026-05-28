import os
file = open("C:/Users/SIMMI/Desktop/note.txt", "w")
file.write("Shahriyar, how are you?")
file.close()
os.system('notepad "C:/Users/SIMMI/Desktop/note.txt"')

