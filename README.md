# Project Name

[Project Instructions](./INSTRUCTIONS.md), this line may be removed once you have updated the README.md

## Description

Your project description goes here. What problem did you solve? How did you solve it?

I solved the problem of creating a calculator that can be interacted with on the client side, but does the calculation on the server side. On the first iteration there were two fields to accept two numbers, and four operation buttons for basic arithmetic. It could also clear the fields, and display the history of calculations. On the second iteration we changed from having two fields to input numbers to having an interface that mimics a real-world calculator - a nine button pad with the four operations aligned on the right, and with the = button in the lower corner. As operations were calculated it would present them in a field beside the clear button. Again a history of prior calculations is displayed below along with the output of the current calculation. In this iteration it can also take a (to my knowledge) arbitrary number of numbers and operations. For example, instead of num1 <operator> num2, it can take num1 <operator> num2 <operator> ...num(N-1)<operator> numN and perform the calculation correctly. 

In both instances the user makes their inputs. When they hit the = button the client side validates the data and an ajax command creates an HTTP Post request to the server. The server then processes the solution. In the first iteration a simple series of if clauses captured output the result. In the second iteration it loops over the user's input looking for * or / operations, and when it finds them it solves that problem, splices it into the array and continues. It then does the same procedure with + and -. This part, is done in the server side function called calculate. I should have cleaned up some of hte code from an earlier attempt, but I chose to leave it in as evidence that it took me a couple tries. Not super happy with that function, it feels inelegant. Then it stored the calculation along with the solution in an object in an array. It then responded to the client, saying the data had processed. The client then makes a GET request for the calculation history, which is returned and displayed. 

In the second iteration a button to clear the server's history is included and uses ajax with a method of DELETE to request the server to delete the information.

I know Edan said it might help to go through the server side endpoints first and then connect up the server, but it helped me to think about it by writing out the code as the user flowed through the program. They come to the page, interact, make a post, the server fields the post request, writes back that it's good, the client says great, please give me the history, and the server does so. I'm not as sure that my process for this one would scale well for bigger projects, though. So I think what I would do next time is try to map it out in a checklist as we've done in class, rather than just sort of walk through the workflow, creating functions as needed. It would probably help cut down on redundant work and confusion.


Additional README details can be found [here](https://github.com/PrimeAcademy/readme-template/blob/master/README.md).
