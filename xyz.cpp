
#include <bits/stdc++.h>
using namespace std;
int main()
{
    int n, h;
    cin >> n >> h; // min high
    int width = 0;

    vector<int> xyz(n);
    for (int i = 0; i < n; ++i)
    {
        cin >> xyz[i];

        if (xyz[i] > h)
        {
            width++;
            width++;
        }
        else
        {
            width++;
        }
    }

    cout << width << endl;
}
