#include<bits/stdc++.h>
using namespace std;
int main ()
{
 int  n , steps = 0  ;
 cin>>n;
 steps = n/5;
 if(n%5!=0)
 {
     steps +=1;
 }
 cout<<steps<<endl;

}



//question :https://codeforces.com/problemset/problem/617/A