import java.nio.file.Files;
import java.nio.file.Paths;
import java.math.BigInteger;
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        try {
            // This line reads the file directly so you don't have to paste anything
            String json = new String(Files.readAllBytes(Paths.get("input.json")));
            
            int k = Integer.parseInt(extract(json, "k"));
            List<Point> points = new ArrayList<>();
            for (int i = 1; i <= 20; i++) {
                if (json.contains("\"" + i + "\"")) {
                    int start = json.indexOf("{", json.indexOf("\"" + i + "\""));
                    int end = json.indexOf("}", start);
                    String block = json.substring(start, end + 1);
                    points.add(new Point(i, new BigInteger(extract(block, "value"), Integer.parseInt(extract(block, "base")))));
                }
            }
            points.sort(Comparator.comparingInt(p -> p.x));
            List<Point> sub = points.subList(0, k);
            BigInteger secret = BigInteger.ZERO;
            for (int i = 0; i < k; i++) {
                BigInteger xi = BigInteger.valueOf(sub.get(i).x), yi = sub.get(i).y;
                BigInteger num = BigInteger.ONE, den = BigInteger.ONE;
                for (int j = 0; j < k; j++) {
                    if (i != j) {
                        BigInteger xj = BigInteger.valueOf(sub.get(j).x);
                        num = num.multiply(xj.negate());
                        den = den.multiply(xi.subtract(xj));
                    }
                }
                secret = secret.add(yi.multiply(num).divide(den));
            }
            System.out.println(secret.toString());
        } catch (Exception e) { e.printStackTrace(); }
    }

    private static String extract(String t, String k) {
        int i = t.indexOf("\"" + k + "\"");
        int c = t.indexOf(":", i);
        int e = t.indexOf(",", c);
        if (e == -1 || e > t.indexOf("}", c)) e = t.indexOf("}", c);
        return t.substring(c + 1, e).replace("\"", "").trim();
    }
    static class Point { int x; BigInteger y; Point(int x, BigInteger y) { this.x = x; this.y = y; }}
}