<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title> Tablo Oluşturma </title>
    <style>
        table { border-collapse: collapse; margin-top: 20px; }
        td { border: 1px solid black; padding: 10px; text-align: center; }
    </style>
</head>
<body>

    <h3>Tablo Oluşturma Formu</h3>
    
    <form method="POST">
        Satır Sayısı: <input type="number" name="satir" required min="1"><br><br>
        Sütun Sayısı: <input type="number" name="sutun" required min="1"><br><br>
        <button type="submit" name="olustur">Tabloyu Oluştur</button>
    </form>

    <hr>

    <?php
    
    if(isset($_POST['olustur'])) {
        
        $satir = $_POST['satir'];
        $sutun = $_POST['sutun'];

        echo "<h4>$satir Satır ve $sutun Sütunlu Tablo:</h4>";
        echo "<table>"; 

    
        for($i = 0; $i < $satir; $i++) {
            echo "<tr>"; 

            
            for($j = 0; $j < $sutun; $j++) {
                
                
                $rastgeleSayi = rand(1, 100);
                
        
                echo "<td>" . $rastgeleSayi . "</td>";
            }

            echo "</tr>"; 
        }

        echo "</table>"; 
    }
    ?>

</body>
</html>