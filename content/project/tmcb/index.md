---
emoji: ๐ฝ๏ธ
title: ์ํ ๋ฆฌ๋ทฐ ์ดํ๋ฆฌ์ผ์ด์
date: '2022-03-14 08:30:00'
author: ์์ค๋ธํธ
tags: blog gatsby theme ๊ฐ์ธ ๋น ํ๋ง
categories: ํ๋ก์ ํธ featured
---

## 1. ํ๋ก์ ํธ ์๊ฐ

์ํ๊ด์ด๋ OTT ์๋น์คํ ํตํด ๋ดค๋ ์ํ๋ค์ ๋ฆฌ๋ทฐ๋ฅผ ๊ด๋ฆฌํ  ์ ์๋ ์๋๋ก์ด๋ ์ ํ๋ฆฌ์ผ์ด์

## 2. ํ๋ก์ ํธ ๊ธฐํ

### 2-1. ๋ฌธ์  ์ธ์

โจ โ๋์ด๋๋ OTT ์๋น์ค, ํ ๊ณณ์์ ๋ชจ๋  ๋ฆฌ๋ทฐ๋ฅผ ๊ด๋ฆฌํ  ์ ์๋ ๊ณต๊ฐ์ ํ์์ฑ"

### 2-2. ๊ฐ๋ฐ ๋ชฉํ

- ์ต์  ์ํ ์ ๋ณด ์ ๊ณต: TMDB API ์ด์ฉ
- ๋ถํ์ํ ๊ด๊ณ  ์ ๊ฑฐ: ๋๋ค์์ ๋ฆฌ๋ทฐ ์ฑ์ ๊ฒฝ์ด ์ธ์ฑ ๊ด๊ณ  ์กด์ฌ
- ํฌํ  ์นด๋์ ์ ์ฌํ ๋์์ธ ๊ตฌ์ถ: ๊ฐ์ฅ ๋ฌด๋ํ ๋์์ธ

### 2-3. ์ ๋ชฉ ์ ์  ์ด์ 

Movie Card ์ Card Book ์ ํฉ์ณ, Movie Card Book ์ผ๋ก ์ ์ .

- Movie Card: ๊ฐ๊ฐ์ ์ํ๋ค์ ํฌํธ ์นด๋์ ๊ฐ์ ํํ๋ก ํํ
- Card Book: ๋ชํจ์ ๋ณด๊ดํ๋ฏ์ด, ๋ฉ์ธ์ ์ฌ๋ฌ ๊ฐ์ ์ํ๋ฅผ ํํ

### 2-4. ์ ์ฌ ์๋น์ค

[Moodie](https://play.google.com/store/apps/details?id=com.memolease.android.simplelog)

- Moodie์์ ์ฐจ์ด์ 

  - ๊ด๊ณ  ์ ๋ณด๊ณ  ์ด์ฉ ๊ฐ๋ฅ
  - ๊ฐ๋ฒผ์ (๊ฒ์ ๋ฐ ๋ฆฌ๋ทฐ ๊ธฐ๋ฅ๋ง ์กด์ฌ)

## 3. ํ๋ก์ ํธ ์ค๊ณ

- Flow Chart
  <!-- <img src="./flow-chart.png"> -->
  ![flow chart](./flow-chart.png)
- ํ๋ฉด ์ค๊ณ์

## 4. ํ๋ก์ ํธ ๊ฐ๋ฐ

### 4-1. ๊ฐ๋ฐ ์ธ์

๋ฌธ์ง์ - 1์ธ ๊ฐ๋ฐ

### 4-2. ๊ฐ๋ฐ ๊ธฐ๊ฐ

๊ธฐํ๋ถํฐ ๋ฐฐํฌ๊น์ง ์ด 6์ฃผ ์์

### 4-3. ๊ฐ๋ฐ ํ๊ฒฝ

- OS: Window 11
- Framework: Android Native
- Editor&Builder: Android Studio Fox
- Theme : Material Design 3
- Test Device: Galaxy Note 10+

### 4-4. ๋ผ์ด๋ธ๋ฌ๋ฆฌ

- Glide / jsoup / okhttp / retrofit / json / Firebase-Firestore / Firebase-Auth

### 4-5. ํต์ฌ ์ฝ๋

```kotlin
//**์ํ ์ ๋ณด ๊ฐ์ ธ์ค๋ ๋ถ๋ถ**
private fun getSearchMovies() {

        binding.pbLoading.visibility = View.VISIBLE

        MoviesRepository.getSearchMovies(
            searchKeyWord,
            ::onSearchMoviesFetched,
            ::onError
        )
    }

    private fun onSearchMoviesFetched(movies: List<Movie>) {
        binding.pbLoading.visibility = View.GONE
        searchMoviesAdapter.updateMovies(movies)
    }

    private fun onError() {
        Toast.makeText(this, "search Error", Toast.LENGTH_SHORT).show()
    }
```

## 5. ํ๋ก์ ํธ ๊ฒฐ๊ณผ

### **์คํ ๊ฒฐ๊ณผ**

<!-- <img src="./layout.png"> -->
![์คํ ํ๋ฉด](./layout.png)

๐[์์ค ์ฝ๋](https://github.com/woongsnote/tmcb)

โ๏ธ[์ค์น ๋งํฌ](https://play.google.com/store/apps/details?id=com.woongsnote.mcb)

```toc

```
