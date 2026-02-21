import java.math.BigInteger;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;

public class solution {

    static class Share {
        BigInteger x;
        BigInteger y;

        Share(BigInteger x, BigInteger y) {
            this.x = x;
            this.y = y;
        }
    }

    public static void main(String[] args) throws Exception {

        String content = new String(
                Files.readAllBytes(Paths.get("testcase1.json"))
        );

        // extract k
        Pattern kPattern = Pattern.compile("\"k\"\\s*:\\s*(\\d+)");
        Matcher km = kPattern.matcher(content);
        km.find();
        int k = Integer.parseInt(km.group(1));

        // extract shares
        Pattern sharePattern = Pattern.compile(
                "\"(\\d+)\"\\s*:\\s*\\{\\s*\"base\"\\s*:\\s*\"(\\d+)\"\\s*,\\s*\"value\"\\s*:\\s*\"([^\"]+)\"");

        Matcher m = sharePattern.matcher(content);

        List<Share> shares = new ArrayList<>();

        while(m.find()) {

            BigInteger x = new BigInteger(m.group(1));
            int base = Integer.parseInt(m.group(2));
            String value = m.group(3);

            BigInteger y = new BigInteger(value, base);

            shares.add(new Share(x,y));
        }

        // sort by x
        shares.sort(Comparator.comparing(s -> s.x));

        // use first k shares
        List<Share> used = shares.subList(0, k);

        BigInteger secret = lagrangeAtZero(used);

        System.out.println("Recovered Secret = " + secret);
    }

    static BigInteger lagrangeAtZero(List<Share> shares){

        BigInteger result = BigInteger.ZERO;
        int k = shares.size();

        for(int i=0;i<k;i++){

            BigInteger numerator = BigInteger.ONE;
            BigInteger denominator = BigInteger.ONE;

            BigInteger xi = shares.get(i).x;
            BigInteger yi = shares.get(i).y;

            for(int j=0;j<k;j++){

                if(i==j) continue;

                BigInteger xj = shares.get(j).x;

                numerator = numerator.multiply(xj.negate());
                denominator = denominator.multiply(
                        xi.subtract(xj)
                );
            }

            BigInteger term =
                    yi.multiply(numerator).divide(denominator);

            result = result.add(term);
        }

        return result;
    }
}