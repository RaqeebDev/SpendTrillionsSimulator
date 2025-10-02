#include <bits/stdc++.h>
using namespace std;
int main()
{
    string s;
    cin >> s;
    int cnt = 0;
    for (long long i = 0; i < s.size(); ++i)
    {
        if (s[i] == '4' || s[i] == '7')
        {
            cnt++;
        }
    }

    if (cnt == 7 || cnt == 4)
    {
        cout << "YES";
    }
    else
    {
        cout << "NO";
    }
}

// cost of first = k
//  initial dollars
// number of bananas