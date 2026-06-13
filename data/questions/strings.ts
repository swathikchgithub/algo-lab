import type { Question } from "@/lib/types";

// Section 2: Strings — Pattern 2.1 String Hashing, Pattern 2.2 Sliding Window
export const stringsQuestions: Question[] = [
  {
    id: "valid-anagram",
    title: "Valid Anagram",
    section: "Strings",
    pattern: "string-hashing",
    difficulty: "Easy",
    description:
      "Given two strings s and t, return true if t is an anagram of s — same letters, same counts, any order.",
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: "true" },
      { input: 's = "rat", t = "car"', output: "false" },
    ],
    constraints: ["1 <= s.length, t.length <= 5*10^4", "s and t consist of lowercase English letters"],
    eli5:
      "Tip both bags of letter-tiles onto the table. If you can pair every tile from one bag with an identical tile from the other and nothing is left over, they're anagrams.",
    hints: [
      "Anagrams have identical letter frequencies — count them.",
      "Different lengths can never be anagrams; bail early.",
      "Add for one string, subtract for the other; every count must end at zero.",
    ],
    approach:
      "If lengths differ, return false. Tally each character of s, then decrement for each character of t. If any count goes negative (or any nonzero remains), they're not anagrams.",
    solutions: {
      python: `def is_anagram(s, t):
    if len(s) != len(t):
        return False
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1
    for ch in t:
        if counts.get(ch, 0) == 0:
            return False  # t has a letter s doesn't (enough of)
        counts[ch] -= 1
    return True`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] counts = new int[26]; // lowercase letters only
        for (char ch : s.toCharArray()) counts[ch - 'a']++;
        for (char ch : t.toCharArray()) {
            if (counts[ch - 'a'] == 0) return false; // missing or exhausted
            counts[ch - 'a']--;
        }
        return true;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Bloomberg", "Microsoft"],
    leetcodeSlug: "valid-anagram",
  },
  {
    id: "group-anagrams",
    title: "Group Anagrams",
    section: "Strings",
    pattern: "string-hashing",
    difficulty: "Medium",
    description:
      "Given an array of strings, group the anagrams together. Return the groups in any order.",
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      },
      { input: 'strs = [""]', output: '[[""]]' },
    ],
    constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] is lowercase English letters"],
    eli5:
      "Give every word a fingerprint by sorting its letters. Words with the same fingerprint go in the same labeled cubby.",
    hints: [
      "Anagrams share a canonical key — what do all anagrams of a word have in common?",
      "Sorting the letters (or a 26-letter count signature) gives the same key for anagrams.",
      "Use that key in a hash map of key → list of words.",
    ],
    approach:
      "For each word, build a canonical key (sorted characters). Append the original word to the list keyed by that signature in a hash map. Return the map's values.",
    solutions: {
      python: `def group_anagrams(strs):
    groups = {}
    for word in strs:
        key = "".join(sorted(word))  # anagrams share sorted letters
        groups.setdefault(key, []).append(word)
    return list(groups.values())`,
      java: `import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String word : strs) {
            char[] chars = word.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars); // canonical signature
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(word);
        }
        return new ArrayList<>(groups.values());
    }
}`,
    },
    timeComplexity: "O(n * k log k)",
    spaceComplexity: "O(n * k)",
    companies: ["Amazon", "Meta", "Uber"],
    leetcodeSlug: "group-anagrams",
  },
  {
    id: "longest-common-prefix",
    title: "Longest Common Prefix",
    section: "Strings",
    pattern: "string-hashing",
    difficulty: "Easy",
    description:
      "Find the longest common prefix string shared by all strings in the array. Return an empty string if none.",
    examples: [
      { input: 'strs = ["flower","flow","flight"]', output: '"fl"' },
      { input: 'strs = ["dog","racecar","car"]', output: '""', explanation: "No common prefix." },
    ],
    constraints: ["1 <= strs.length <= 200", "0 <= strs[i].length <= 200", "strs[i] is lowercase English letters"],
    eli5:
      "Line up every word and read down each column. The moment one column has a mismatched letter, the matching part you've read so far is the answer.",
    hints: [
      "The common prefix can't be longer than the shortest word.",
      "Compare characters column by column across all words.",
      "Stop at the first column where any word differs or ends.",
    ],
    approach:
      "Walk character positions of the first word. At each position, check that every other string has the same character there. Stop at the first mismatch or when any string ends, returning the matched portion.",
    solutions: {
      python: `def longest_common_prefix(strs):
    prefix = strs[0]
    for word in strs[1:]:
        # shrink the prefix until it matches the start of word
        while not word.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix`,
      java: `class Solution {
    public String longestCommonPrefix(String[] strs) {
        String prefix = strs[0];
        for (int i = 1; i < strs.length; i++) {
            // shrink the prefix until it matches the start of strs[i]
            while (strs[i].indexOf(prefix) != 0) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) return "";
            }
        }
        return prefix;
    }
}`,
    },
    timeComplexity: "O(S)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Adobe", "Microsoft"],
    leetcodeSlug: "longest-common-prefix",
  },
  {
    id: "reverse-words-in-a-string",
    title: "Reverse Words in a String",
    section: "Strings",
    pattern: "string-hashing",
    difficulty: "Medium",
    description:
      "Given a string, reverse the order of the words. A word is a maximal run of non-space characters. Collapse multiple spaces and trim leading/trailing spaces.",
    examples: [
      { input: 's = "the sky is blue"', output: '"blue is sky the"' },
      { input: 's = "  hello world  "', output: '"world hello"', explanation: "Extra spaces are removed." },
    ],
    constraints: ["1 <= s.length <= 10^4", "s contains English letters, digits, and spaces"],
    eli5:
      "Pick out each word like beads off a string, ignore the empty gaps, then thread the beads back on in the opposite order.",
    hints: [
      "Splitting on whitespace naturally drops the empty tokens from extra spaces.",
      "Reverse the list of words.",
      "Join them back with a single space.",
    ],
    approach:
      "Split the string on runs of whitespace into a list of words (which discards empties), reverse that list, and join with single spaces.",
    solutions: {
      python: `def reverse_words(s):
    words = s.split()  # split() with no args drops all extra whitespace
    return " ".join(reversed(words))`,
      java: `class Solution {
    public String reverseWords(String s) {
        // trim ends, split on runs of whitespace (drops empties)
        String[] words = s.trim().split("\\\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = words.length - 1; i >= 0; i--) {
            sb.append(words[i]);
            if (i > 0) sb.append(" "); // single space between words
        }
        return sb.toString();
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Microsoft", "Apple"],
    leetcodeSlug: "reverse-words-in-a-string",
  },
  {
    id: "string-to-integer-atoi",
    title: "String to Integer (atoi)",
    section: "Strings",
    pattern: "string-hashing",
    difficulty: "Medium",
    description:
      "Implement atoi: skip leading whitespace, read an optional +/- sign, then read digits until a non-digit. Clamp the result to the 32-bit signed integer range [-2^31, 2^31 - 1].",
    examples: [
      { input: 's = "42"', output: "42" },
      { input: 's = "   -42"', output: "-42", explanation: "Leading spaces skipped, sign applied." },
      { input: 's = "4193 with words"', output: "4193", explanation: "Parsing stops at the first non-digit." },
      { input: 's = "words and 987"', output: "0", explanation: "No leading digits, so result is 0." },
    ],
    constraints: ["0 <= s.length <= 200", "s consists of letters, digits, spaces, '+', '-', and '.'"],
    eli5:
      "Read the number off a sign slowly: ignore the blank space at the front, note a plus/minus, then collect digits until the first non-number. If the total exceeds the meter's limit, peg it at the limit.",
    hints: [
      "Process in fixed order: whitespace, then sign, then digits.",
      "Stop at the first character that isn't a digit.",
      "Clamp to INT_MIN / INT_MAX rather than letting the value overflow.",
    ],
    approach:
      "Scan past leading spaces. Read an optional sign. Accumulate digits into a running number, multiplying by 10 each step. After (or during) accumulation, clamp to [-2^31, 2^31 - 1]. Stop at the first non-digit and apply the sign.",
    solutions: {
      python: `def my_atoi(s):
    INT_MIN, INT_MAX = -2**31, 2**31 - 1
    i, n = 0, len(s)
    while i < n and s[i] == ' ':   # 1) skip leading spaces
        i += 1
    sign = 1
    if i < n and s[i] in '+-':     # 2) optional sign
        sign = -1 if s[i] == '-' else 1
        i += 1
    num = 0
    while i < n and s[i].isdigit():  # 3) read digits
        num = num * 10 + int(s[i])
        i += 1
    num *= sign
    # 4) clamp to 32-bit signed range
    return max(INT_MIN, min(INT_MAX, num))`,
      java: `class Solution {
    public int myAtoi(String s) {
        int i = 0, n = s.length();
        while (i < n && s.charAt(i) == ' ') i++;   // 1) skip leading spaces
        int sign = 1;
        if (i < n && (s.charAt(i) == '+' || s.charAt(i) == '-')) {
            sign = s.charAt(i) == '-' ? -1 : 1;    // 2) optional sign
            i++;
        }
        // 3) read digits, clamping on overflow before it happens
        int num = 0;
        while (i < n && Character.isDigit(s.charAt(i))) {
            int digit = s.charAt(i) - '0';
            // would num*10 + digit overflow the signed 32-bit range?
            if (num > (Integer.MAX_VALUE - digit) / 10) {
                return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
            }
            num = num * 10 + digit;
            i++;
        }
        return num * sign;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Microsoft", "Bloomberg", "Adobe"],
    leetcodeSlug: "string-to-integer-atoi",
  },
  {
    id: "roman-to-integer",
    title: "Roman to Integer",
    section: "Strings",
    pattern: "string-hashing",
    difficulty: "Easy",
    description:
      "Convert a Roman numeral string to an integer. Normally values are added, but a smaller value before a larger one is subtracted (e.g. IV = 4, IX = 9).",
    examples: [
      { input: 's = "III"', output: "3" },
      { input: 's = "LVIII"', output: "58", explanation: "L=50, V=5, III=3." },
      { input: 's = "MCMXCIV"', output: "1994", explanation: "M=1000, CM=900, XC=90, IV=4." },
    ],
    constraints: ["1 <= s.length <= 15", "s is a valid Roman numeral in [1, 3999]"],
    eli5:
      "Read the symbols left to right and add them up. But if a small symbol sits just before a bigger one, it's a discount — subtract it instead of adding.",
    hints: [
      "Map each Roman symbol to its value.",
      "Usually you add; the exception is a smaller value immediately left of a larger one.",
      "Compare each symbol with the one after it to decide add vs subtract.",
    ],
    approach:
      "Map symbols to values. Walk the string; if the current value is less than the next value, subtract it, otherwise add it. The last symbol is always added.",
    solutions: {
      python: `def roman_to_int(s):
    vals = {'I': 1, 'V': 5, 'X': 10, 'L': 50,
            'C': 100, 'D': 500, 'M': 1000}
    total = 0
    for i in range(len(s)):
        # subtract if a smaller value precedes a larger one
        if i + 1 < len(s) and vals[s[i]] < vals[s[i + 1]]:
            total -= vals[s[i]]
        else:
            total += vals[s[i]]
    return total`,
      java: `import java.util.*;

class Solution {
    public int romanToInt(String s) {
        Map<Character, Integer> vals = Map.of(
            'I', 1, 'V', 5, 'X', 10, 'L', 50,
            'C', 100, 'D', 500, 'M', 1000);
        int total = 0;
        for (int i = 0; i < s.length(); i++) {
            int cur = vals.get(s.charAt(i));
            // subtract if a smaller value precedes a larger one
            if (i + 1 < s.length() && cur < vals.get(s.charAt(i + 1))) {
                total -= cur;
            } else {
                total += cur;
            }
        }
        return total;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Microsoft", "Apple"],
    leetcodeSlug: "roman-to-integer",
  },
  {
    id: "integer-to-roman",
    title: "Integer to Roman",
    section: "Strings",
    pattern: "string-hashing",
    difficulty: "Medium",
    description:
      "Convert an integer in [1, 3999] to its Roman numeral representation, including the subtractive forms (IV, IX, XL, XC, CD, CM).",
    examples: [
      { input: "num = 3", output: '"III"' },
      { input: "num = 58", output: '"LVIII"' },
      { input: "num = 1994", output: '"MCMXCIV"' },
    ],
    constraints: ["1 <= num <= 3999"],
    eli5:
      "Pay the number like cash using Roman 'coins' from biggest to smallest, including special discount coins (CM, CD, XC, XL, IX, IV). Hand over as many of each as fit before moving to the next.",
    hints: [
      "List value/symbol pairs in descending order, including subtractive ones.",
      "Greedily subtract the largest value that fits and append its symbol.",
      "Repeat until the number reaches zero.",
    ],
    approach:
      "Keep value/symbol pairs in descending order (1000, 900, 500, 400, …, 1). For each pair, append its symbol while it fits, subtracting the value each time. This greedy choice is optimal because the value set is canonical.",
    solutions: {
      python: `def int_to_roman(num):
    pairs = [(1000, 'M'), (900, 'CM'), (500, 'D'), (400, 'CD'),
             (100, 'C'), (90, 'XC'), (50, 'L'), (40, 'XL'),
             (10, 'X'), (9, 'IX'), (5, 'V'), (4, 'IV'), (1, 'I')]
    res = []
    for value, symbol in pairs:
        while num >= value:    # greedily emit the biggest coin that fits
            res.append(symbol)
            num -= value
    return "".join(res)`,
      java: `class Solution {
    public String intToRoman(int num) {
        int[] values = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
        String[] symbols = {"M", "CM", "D", "CD", "C", "XC", "L", "XL",
                            "X", "IX", "V", "IV", "I"};
        StringBuilder res = new StringBuilder();
        for (int i = 0; i < values.length; i++) {
            while (num >= values[i]) { // greedily emit the biggest coin that fits
                res.append(symbols[i]);
                num -= values[i];
            }
        }
        return res.toString();
    }
}`,
    },
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Microsoft", "Adobe"],
    leetcodeSlug: "integer-to-roman",
  },
  {
    id: "count-and-say",
    title: "Count and Say",
    section: "Strings",
    pattern: "string-hashing",
    difficulty: "Medium",
    description:
      "The count-and-say sequence starts at \"1\". Each next term is produced by reading the previous term as runs of identical digits: for each run say its count then the digit. Return the nth term.",
    examples: [
      { input: "n = 1", output: '"1"' },
      { input: "n = 4", output: '"1211"', explanation: '1 -> 11 -> 21 -> 1211.' },
    ],
    constraints: ["1 <= n <= 30"],
    eli5:
      "Read the previous line out loud the way a kid would: 'one 1' becomes 11, 'two 1s' becomes 21. Write down exactly what you said, then read that line the same way.",
    hints: [
      "Build each term from the previous one — you can't jump straight to n.",
      "Scan the previous term grouping consecutive equal digits.",
      "For each group append count followed by the digit.",
    ],
    approach:
      "Start with \"1\". Repeat n-1 times: scan the current term, count consecutive equal digits, and build the next term by appending each run's length followed by its digit.",
    solutions: {
      python: `def count_and_say(n):
    term = "1"
    for _ in range(n - 1):
        next_term = []
        i = 0
        while i < len(term):
            j = i
            while j < len(term) and term[j] == term[i]:
                j += 1  # extend the run of equal digits
            next_term.append(str(j - i))  # count
            next_term.append(term[i])     # digit
            i = j
        term = "".join(next_term)
    return term`,
      java: `class Solution {
    public String countAndSay(int n) {
        String term = "1";
        for (int k = 1; k < n; k++) {
            StringBuilder next = new StringBuilder();
            int i = 0;
            while (i < term.length()) {
                int j = i;
                // extend the run of equal digits
                while (j < term.length() && term.charAt(j) == term.charAt(i)) j++;
                next.append(j - i);            // count
                next.append(term.charAt(i));   // digit
                i = j;
            }
            term = next.toString();
        }
        return term;
    }
}`,
    },
    timeComplexity: "O(n * m)",
    spaceComplexity: "O(m)",
    companies: ["Amazon", "Meta", "Apple"],
    leetcodeSlug: "count-and-say",
  },
  {
    id: "zigzag-conversion",
    title: "ZigZag Conversion",
    section: "Strings",
    pattern: "string-hashing",
    difficulty: "Medium",
    description:
      "Write the characters of a string in a zigzag pattern across a given number of rows, then read the rows left to right, top to bottom, to form the output.",
    examples: [
      { input: 's = "PAYPALISHIRING", numRows = 3', output: '"PAHNAPLSIIGYIR"' },
      { input: 's = "PAYPALISHIRING", numRows = 4', output: '"PINALSIGYAHRPI"' },
      { input: 's = "A", numRows = 1', output: '"A"' },
    ],
    constraints: ["1 <= s.length <= 1000", "1 <= numRows <= 1000", "s consists of English letters, ',' and '.'"],
    eli5:
      "Imagine writing the letters down a staircase: down the steps, then diagonally back up, then down again. When you read each step's row across, you get the coded message.",
    hints: [
      "Simulate the zigzag by tracking which row each character lands in.",
      "Walk a row index that bounces between 0 and numRows-1.",
      "Flip direction at the top and bottom rows; one row means no zigzag.",
    ],
    approach:
      "Keep one string per row. Walk a current-row pointer that increases then decreases, flipping direction at the top and bottom rows, appending each character to its row. Concatenate all rows. Handle numRows == 1 directly.",
    solutions: {
      python: `def convert(s, num_rows):
    if num_rows == 1:
        return s  # no zigzag possible
    rows = [""] * num_rows
    row, step = 0, 1
    for ch in s:
        rows[row] += ch
        if row == 0:
            step = 1            # bounce down
        elif row == num_rows - 1:
            step = -1           # bounce up
        row += step
    return "".join(rows)`,
      java: `class Solution {
    public String convert(String s, int numRows) {
        if (numRows == 1) return s; // no zigzag possible
        StringBuilder[] rows = new StringBuilder[numRows];
        for (int i = 0; i < numRows; i++) rows[i] = new StringBuilder();
        int row = 0, step = 1;
        for (char ch : s.toCharArray()) {
            rows[row].append(ch);
            if (row == 0) step = 1;                 // bounce down
            else if (row == numRows - 1) step = -1; // bounce up
            row += step;
        }
        StringBuilder res = new StringBuilder();
        for (StringBuilder r : rows) res.append(r);
        return res.toString();
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Bloomberg", "Adobe"],
    leetcodeSlug: "zigzag-conversion",
  },
  {
    id: "multiply-strings",
    title: "Multiply Strings",
    section: "Strings",
    pattern: "string-hashing",
    difficulty: "Medium",
    description:
      "Given two non-negative integers represented as strings, return their product as a string. Do not use built-in big-integer libraries or convert the inputs to a number directly.",
    examples: [
      { input: 'num1 = "2", num2 = "3"', output: '"6"' },
      { input: 'num1 = "123", num2 = "456"', output: '"56088"' },
    ],
    constraints: ["1 <= num1.length, num2.length <= 200", "num1 and num2 consist of digits only", "No leading zeros except \"0\" itself"],
    eli5:
      "Do grade-school multiplication: multiply each digit pair, drop each result into the right column of a long answer strip, then carry the tens over just like by hand.",
    hints: [
      "The product of an m-digit and n-digit number has at most m+n digits.",
      "Digit i of num1 times digit j of num2 contributes to positions i+j and i+j+1.",
      "Accumulate into an integer array, then handle carries and strip leading zeros.",
    ],
    approach:
      "Allocate a result array of size m+n. For each pair of digits, multiply and add into positions i+j+1 (and carry into i+j). After filling, propagate carries, convert digits to characters, and strip any leading zero.",
    solutions: {
      python: `def multiply(num1, num2):
    if num1 == "0" or num2 == "0":
        return "0"
    m, n = len(num1), len(num2)
    res = [0] * (m + n)
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            mul = int(num1[i]) * int(num2[j])
            # positions: low digit at i+j+1, carry into i+j
            total = mul + res[i + j + 1]
            res[i + j + 1] = total % 10
            res[i + j] += total // 10
    # skip leading zeros, then join
    start = 0
    while start < len(res) - 1 and res[start] == 0:
        start += 1
    return "".join(map(str, res[start:]))`,
      java: `class Solution {
    public String multiply(String num1, String num2) {
        if (num1.equals("0") || num2.equals("0")) return "0";
        int m = num1.length(), n = num2.length();
        int[] res = new int[m + n];
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                int mul = (num1.charAt(i) - '0') * (num2.charAt(j) - '0');
                // low digit lands at i+j+1, carry goes into i+j
                int total = mul + res[i + j + 1];
                res[i + j + 1] = total % 10;
                res[i + j] += total / 10;
            }
        }
        StringBuilder sb = new StringBuilder();
        int start = 0;
        while (start < res.length - 1 && res[start] == 0) start++; // strip leading zeros
        for (int k = start; k < res.length; k++) sb.append(res[k]);
        return sb.toString();
    }
}`,
    },
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(m + n)",
    companies: ["Amazon", "Meta", "Microsoft"],
    leetcodeSlug: "multiply-strings",
  },
  {
    id: "longest-palindrome-rearrangement",
    title: "Longest Palindrome",
    section: "Strings",
    pattern: "string-hashing",
    difficulty: "Easy",
    description:
      "Given a string of letters, return the length of the longest palindrome that can be built using those letters (case-sensitive). Letters may be rearranged; each letter is used at most as many times as it appears.",
    examples: [
      { input: 's = "abccccdd"', output: "7", explanation: 'e.g. "dccaccd" has length 7.' },
      { input: 's = "a"', output: "1" },
    ],
    constraints: ["1 <= s.length <= 2000", "s consists of lowercase and/or uppercase English letters"],
    eli5:
      "A palindrome mirrors around its center, so every letter must pair up. Count each letter; use as many pairs as you can, and you're allowed exactly one leftover letter to sit in the very middle.",
    hints: [
      "A palindrome uses each letter in pairs, plus optionally one odd letter in the center.",
      "Count letter frequencies; each even chunk fully contributes.",
      "If any letter has an odd count, you may add exactly one to the center.",
    ],
    approach:
      "Count each character. Sum the largest even portion of every count (count rounded down to even). If any count was odd, you can place one odd letter in the middle, so add 1.",
    solutions: {
      python: `def longest_palindrome(s):
    from collections import Counter
    counts = Counter(s)
    length = 0
    has_odd = False
    for c in counts.values():
        length += c - (c % 2)   # take all complete pairs
        if c % 2 == 1:
            has_odd = True
    return length + 1 if has_odd else length  # one odd letter can sit in the center`,
      java: `import java.util.*;

class Solution {
    public int longestPalindrome(String s) {
        Map<Character, Integer> counts = new HashMap<>();
        for (char ch : s.toCharArray()) {
            counts.merge(ch, 1, Integer::sum);
        }
        int length = 0;
        boolean hasOdd = false;
        for (int c : counts.values()) {
            length += c - (c % 2); // take all complete pairs
            if (c % 2 == 1) hasOdd = true;
        }
        return hasOdd ? length + 1 : length; // one odd letter can sit in the center
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Google", "Bloomberg"],
    leetcodeSlug: "longest-palindrome",
  },
  {
    id: "first-unique-character",
    title: "First Unique Character in a String",
    section: "Strings",
    pattern: "string-hashing",
    difficulty: "Easy",
    description:
      "Given a string, return the index of the first character that appears exactly once. If no such character exists, return -1.",
    examples: [
      { input: 's = "leetcode"', output: "0", explanation: "'l' is the first non-repeating character." },
      { input: 's = "loveleetcode"', output: "2", explanation: "'v' at index 2 is the first unique character." },
      { input: 's = "aabb"', output: "-1" },
    ],
    constraints: ["1 <= s.length <= 10^5", "s consists of lowercase English letters"],
    eli5:
      "First, tally how many times each letter shows up. Then walk through the word again and point at the first letter whose tally is exactly one.",
    hints: [
      "Two passes: count first, then find.",
      "First pass builds a frequency map of every character.",
      "Second pass returns the index of the first character with count 1.",
    ],
    approach:
      "First pass tallies character frequencies. Second pass scans left to right and returns the index of the first character whose count is 1. If none, return -1.",
    solutions: {
      python: `def first_uniq_char(s):
    from collections import Counter
    counts = Counter(s)              # pass 1: tally frequencies
    for i, ch in enumerate(s):       # pass 2: first count-1 char
        if counts[ch] == 1:
            return i
    return -1`,
      java: `class Solution {
    public int firstUniqChar(String s) {
        int[] counts = new int[26];
        for (char ch : s.toCharArray()) counts[ch - 'a']++; // pass 1: tally
        for (int i = 0; i < s.length(); i++) {              // pass 2: first unique
            if (counts[s.charAt(i) - 'a'] == 1) return i;
        }
        return -1;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Microsoft", "Bloomberg"],
    leetcodeSlug: "first-unique-character-in-a-string",
  },
  {
    id: "longest-repeating-character-replacement",
    title: "Longest Repeating Character Replacement",
    section: "Strings",
    pattern: "sliding-window",
    difficulty: "Medium",
    description:
      "Given a string of uppercase letters and an integer k, you may replace at most k characters with any letter. Return the length of the longest substring containing a single repeated letter you can obtain.",
    examples: [
      { input: 's = "ABAB", k = 2', output: "4", explanation: 'Replace the two A\'s (or B\'s) to get "AAAA" or "BBBB".' },
      { input: 's = "AABABBA", k = 1', output: "4", explanation: 'Replace one A to make "AABBBBA" -> "BBBB".' },
    ],
    constraints: ["1 <= s.length <= 10^5", "s consists of uppercase English letters", "0 <= k <= s.length"],
    eli5:
      "Slide a window across the string. A window is valid if everything except the most common letter can be repainted with k or fewer strokes. Grow it greedily and only ever nudge the left edge forward.",
    hints: [
      "A window is valid when (window length - count of its most frequent letter) <= k.",
      "Track letter counts inside the window and the max single-letter count seen.",
      "When the window becomes invalid, slide the left edge right by one (the window never shrinks below its best size).",
    ],
    approach:
      "Slide a window with a frequency map. Track maxCount, the highest single-letter frequency seen. If (windowSize - maxCount) > k, the window needs too many replacements, so advance left by one. The answer is the largest valid window width, which the window length tracks directly.",
    solutions: {
      python: `def character_replacement(s, k):
    counts = {}
    left = 0
    max_count = 0   # most frequent letter count seen in any window
    best = 0
    for right in range(len(s)):
        counts[s[right]] = counts.get(s[right], 0) + 1
        max_count = max(max_count, counts[s[right]])
        # if replacements needed exceed k, shrink from the left
        if (right - left + 1) - max_count > k:
            counts[s[left]] -= 1
            left += 1
        best = max(best, right - left + 1)
    return best`,
      java: `class Solution {
    public int characterReplacement(String s, int k) {
        int[] counts = new int[26];
        int left = 0, maxCount = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            counts[s.charAt(right) - 'A']++;
            maxCount = Math.max(maxCount, counts[s.charAt(right) - 'A']);
            // replacements needed = windowSize - maxCount; if > k, slide left
            if (right - left + 1 - maxCount > k) {
                counts[s.charAt(left) - 'A']--;
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`,
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Google", "Meta"],
    leetcodeSlug: "longest-repeating-character-replacement",
  },
  {
    id: "minimum-window-substring",
    title: "Minimum Window Substring",
    section: "Strings",
    pattern: "sliding-window",
    difficulty: "Hard",
    description:
      "Given strings s and t, return the shortest substring of s that contains every character of t including duplicates. If no such window exists, return the empty string.",
    examples: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' },
      { input: 's = "a", t = "a"', output: '"a"' },
      { input: 's = "a", t = "aa"', output: '""', explanation: "s has only one 'a' but two are needed." },
    ],
    constraints: ["1 <= s.length, t.length <= 10^5", "s and t consist of uppercase and lowercase English letters"],
    eli5:
      "You need to collect a full shopping list from a shelf row. Walk right grabbing items until your basket holds every required item, then squeeze in from the left to drop anything extra, remembering the smallest complete basket you ever held.",
    hints: [
      "Count what t requires, then expand a window over s until it covers all required characters.",
      "Track how many required characters are currently satisfied so you know when the window is valid.",
      "Once valid, shrink from the left to minimize, updating the best window before dropping a needed character.",
    ],
    approach:
      "Build a need map from t and a 'required' count of distinct chars. Expand right, decrementing need; when a char's need hits zero a requirement is met (formed++). While formed == required, the window is valid: record it if smaller, then shrink from left, incrementing need and decrementing formed when a needed char drops below its requirement. Return the best window found.",
    solutions: {
      python: `def min_window(s, t):
    if not s or not t or len(s) < len(t):
        return ""
    from collections import Counter
    need = Counter(t)
    required = len(need)        # distinct chars that must be satisfied
    formed = 0                  # distinct chars currently satisfied
    left = 0
    best_len = float('inf')
    best_left = 0
    for right in range(len(s)):
        ch = s[right]
        if ch in need:
            need[ch] -= 1
            if need[ch] == 0:
                formed += 1
        # shrink while the window is valid
        while formed == required:
            if right - left + 1 < best_len:
                best_len = right - left + 1
                best_left = left
            lch = s[left]
            if lch in need:
                need[lch] += 1
                if need[lch] > 0:   # we just removed a still-needed char
                    formed -= 1
            left += 1
    return "" if best_len == float('inf') else s[best_left:best_left + best_len]`,
      java: `import java.util.*;

class Solution {
    public String minWindow(String s, String t) {
        if (s.isEmpty() || t.isEmpty() || s.length() < t.length()) return "";
        Map<Character, Integer> need = new HashMap<>();
        for (char ch : t.toCharArray()) need.merge(ch, 1, Integer::sum);
        int required = need.size(); // distinct chars to satisfy
        int formed = 0;             // distinct chars satisfied
        int left = 0, bestLen = Integer.MAX_VALUE, bestLeft = 0;
        for (int right = 0; right < s.length(); right++) {
            char ch = s.charAt(right);
            if (need.containsKey(ch)) {
                need.merge(ch, -1, Integer::sum);
                if (need.get(ch) == 0) formed++;
            }
            // shrink while the window covers all of t
            while (formed == required) {
                if (right - left + 1 < bestLen) {
                    bestLen = right - left + 1;
                    bestLeft = left;
                }
                char lch = s.charAt(left);
                if (need.containsKey(lch)) {
                    need.merge(lch, 1, Integer::sum);
                    if (need.get(lch) > 0) formed--; // dropped a still-needed char
                }
                left++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestLeft, bestLeft + bestLen);
    }
}`,
    },
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(m)",
    companies: ["Amazon", "Meta", "Google", "Microsoft"],
    leetcodeSlug: "minimum-window-substring",
  },
];
