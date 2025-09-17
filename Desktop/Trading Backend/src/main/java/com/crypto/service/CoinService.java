package com.crypto.service;

import com.crypto.Model.Coin;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface CoinService {
    List<Coin> getCoinList(int page) throws Exception;
    String getMarketChart(String coinId,int days) throws Exception;
    String getCoinDetails(String coinId) throws Exception;
    Coin findById(String coinId) throws Exception;
    String searchCoin(String keyword) throws Exception;
    String getTop50CoinByMarketCapRank() throws Exception;
    String getTreadingCoins() throws Exception;

}
