#ifndef ARRAY_LIST_AB_H
#define ARRAY_LIST_AB_H

#include "Arduino.h"

template <typename T>
class ArrayListAB {
   public:
    class Iterator {
       public:
        Iterator(T* ptr)
            : m_Ptr(ptr) {}

        Iterator operator++() {
            ++m_Ptr;
            return *this;
        }

        Iterator operator++(int) {
            Iterator tmp = *this;
            ++m_Ptr;
            return tmp;
        }

        Iterator operator--() {
            --m_Ptr;
            return *this;
        }

        Iterator operator--(int) {
            Iterator tmp = *this;
            --m_Ptr;
            return tmp;
        }

        Iterator operator+(const int& n) {
            return Iterator(m_Ptr + n);
        }

        Iterator operator-(const int& n) {
            return Iterator(m_Ptr - n);
        }

        Iterator& operator+=(const int& n) {
            m_Ptr += n;
            return *this;
        }

        Iterator& operator-=(const int& n) {
            m_Ptr -= n;
            return *this;
        }

        bool operator==(const Iterator& other) {
            return m_Ptr == other.m_Ptr;
        }

        bool operator!=(const Iterator& other) const {
            return m_Ptr != other.m_Ptr;
        }

        T& operator[](const int& n) {
            return *(m_Ptr + n);
        }

        T& operator*() const {
            return *m_Ptr;
        }

        T* operator->() const {
            return m_Ptr;
        }

       private:
        T* m_Ptr;
    };

    ArrayListAB()
        : m_Data(NULL),
          m_Size(0),
          m_Capacity(0) {
        _reallocate(8); //default size
    }

    ArrayListAB(const ArrayListAB& other)
        : ArrayListAB() {
        if (_reallocate(other.m_Capacity)) {
            m_Size            = other.m_Size;
            const size_t size = m_Size * sizeof(T);
            memcpy(m_Data, other.m_Data, size);
        }
    }

    ArrayListAB(ArrayListAB&& other) noexcept
        : ArrayListAB() {
        _swap(other);
    }

    ArrayListAB(T arr[], size_t len)
        : m_Data(NULL),
          m_Size(0),
          m_Capacity(0) {
        if (_reallocate(len + len / 2)) {
            for (size_t i = 0; i < len; i++) {
                add(arr[i]);
            }
        }
    }

    template <typename... Args>
    ArrayListAB(Args... args)
        : ArrayListAB() {
        if (_reallocate(sizeof...(args) + sizeof...(args) / 2)) {
            int dummy[] = {(add(args), 0)...};
            (void)dummy;
        }
    }

    ~ArrayListAB() {
        _deallocate();
    }

    bool add(const T& element) {
        if (m_Size >= m_Capacity) {
            if (!_reallocate(m_Capacity + m_Capacity / 2)) return false;
        }
        m_Data[m_Size] = element;
        m_Size++;
        return true;
    }

    bool insertAt(size_t index, const T& element) {
      if (index > m_Size) {
          return false;  // Índice fuera de rango
      }

      // Verifica si se necesita más capacidad y realoca si es necesario
      if (m_Size >= m_Capacity) {
          if (!_reallocate(m_Capacity + m_Capacity / 2)) {
              return false;  // Error al realocar memoria
          }
      }

      // Desplaza los elementos a la derecha para abrir espacio
      for (size_t i = m_Size; i > index; i--) {
          m_Data[i] = m_Data[i - 1];
      }

      // Inserta el nuevo elemento
      m_Data[index] = element;
      m_Size++;  // Incrementa el tamaño
      return true;
  }

    bool addAll(const ArrayListAB& other) {
        if (m_Size + other.m_Size >= m_Capacity) {
            if (!_reallocate(m_Capacity + other.m_Capacity)) return false;
        }
        for (size_t i = 0; i < other.m_Size; i++) {
            m_Data[m_Size + i] = other.m_Data[i];
        }
        m_Size += other.m_Size;
        return true;
    }

    void resize(const size_t& newSize) {
        _reallocate(newSize);
    }

    void remove(const T& element) {
        removeAt(indexOf(element));
    }

    void removeAt(size_t index) {
        if (index < 0) return;
        m_Size--;
        for (size_t i = index; i < m_Size; i++) {
            m_Data[i] = m_Data[i + 1];
        }
    }

    void clear() {
        _deallocate();
        _reallocate(8);
    }

    T get(const size_t& index, const T& defaultValue) {
        if (index >= m_Size) return const_cast<T&>(defaultValue);
        return m_Data[index];
    }

    T& operator[](const size_t& index) {
        return m_Data[index];
    }

    ArrayListAB& operator=(const ArrayListAB& other) {
        m_Size = 0;
        if (_reallocate(other.m_Capacity)) {
            m_Size            = other.m_Size;
            const size_t size = m_Size * sizeof(T);
            memcpy(m_Data, other.m_Data, size);
        }
        return *this;
    }

    ArrayListAB& operator=(ArrayListAB&& other) noexcept {
        _swap(other);
        return *this;
    }

    template <typename Callable>
    void sort(Callable predicate) {
        for (size_t i = 1; i < m_Size; i++) {
            for (size_t j = i; j > 0 && predicate(m_Data[j - 1], m_Data[j]); j--) {
                T tmp         = m_Data[j - 1];
                m_Data[j - 1] = m_Data[j];
                m_Data[j]     = tmp;
            }
        }
    }

    void sort() {
        sort([](T a, T b) -> bool { return a > b; });
    }

    void reverse() {
        for (size_t i = 0; i < m_Size / 2; i++) {
            T buffer               = m_Data[i];
            m_Data[i]              = m_Data[m_Size - 1 - i];
            m_Data[m_Size - 1 - i] = buffer;
        }
    }

    Iterator begin() {
        return Iterator(m_Data);
    }

    Iterator end() {
        return Iterator(m_Data + m_Size);
    }

    size_t size() const {
        return m_Size;
    }

    bool isEmpty() const {
        return m_Size == 0;
    }


///////////////////////// STATISTICS FUNCTIONS (only numeric values ) /////////////////////////////7

// Suma de todos los elementos en el ArrayListAB
T sum() const {
    T total = 0;
    for (size_t i = 0; i < m_Size; i++) {
        total += m_Data[i];
    }
    return total;
}

// Valor mínimo en el ArrayListAB
T minim() const {
    T minValue = m_Data[0];
    for (size_t i = 1; i < m_Size; i++) {
        if (m_Data[i] < minValue) {
            minValue = m_Data[i];
        }
    }
    return minValue;
}

// Valor máximo en el ArrayListAB
T maxim() const {
    T maxValue = m_Data[0];
    for (size_t i = 1; i < m_Size; i++) {
        if (m_Data[i] > maxValue) {
            maxValue = m_Data[i];
        }
    }
    return maxValue;
}

// Promedio de los elementos en el ArrayListAB
double average() const {
    return static_cast<double>(sum()) / m_Size;
}

// Mediana de los elementos en el ArrayListAB
double median() const {
    ArrayListAB<T> sortedList = *this;
    sortedList.sort();
    if (m_Size % 2 == 0) {
        return (sortedList[m_Size / 2 - 1] + sortedList[m_Size / 2]) / 2.0;
    } else {
        return sortedList[m_Size / 2];
    }
}

// Moda de los elementos en el ArrayListAB
T mode() const {
    T modeValue = m_Data[0];
    int maxCount = 0;
    for (size_t i = 0; i < m_Size; i++) {
        int count = 0;
        for (size_t j = 0; j < m_Size; j++) {
            if (m_Data[j] == m_Data[i]) {
                count++;
            }
        }
        if (count > maxCount) {
            maxCount = count;
            modeValue = m_Data[i];
        }
    }
    return modeValue;
}

// Rango de los elementos en el ArrayListAB
T range() const {
    return maxim() - minim();
}

// Desviación estándar de los elementos en el ArrayListAB
double standardDeviation() const {
    double avg = average();
    double sumSquaredDifferences = 0;
    for (size_t i = 0; i < m_Size; i++) {
        sumSquaredDifferences += (m_Data[i] - avg) * (m_Data[i] - avg);
    }
    return approximateSqrt(sumSquaredDifferences / m_Size);
}

// Cuartiles de los elementos en el ArrayListAB
double quartile(int q) const {
    ArrayListAB<T> sortedList = *this;
    sortedList.sort();
    if (q == 1) {
        return sortedList[m_Size / 4];
    } else if (q == 2) {
        return median();
    } else if (q == 3) {
        return sortedList[(3 * m_Size) / 4];
    } 
    return 0; //error
}

/////////////////////////

   private:
    T* m_Data;
    size_t m_Size;
    size_t m_Capacity;

  // Función de raíz cuadrada aproximada (Newton-Raphson)
  double approximateSqrt(double value) const {
    double guess = value / 2.0;
    for (int i = 0; i < 10; i++) {
        guess = (guess + value / guess) / 2.0;
    }
    return guess;
  }

    bool _reallocate(size_t newCapacity) {
        T* newBlock = new T[newCapacity];
        if (newBlock) {
            if (newCapacity < m_Size) {
                m_Size = newCapacity;
            }
            for (size_t i = 0; i < m_Size; i++) {
                newBlock[i] = m_Data[i];
            }
            delete[] m_Data;
            m_Data     = newBlock;
            m_Capacity = newCapacity;
            return true;
        }
        return false;
    }

    void _deallocate() {
        delete[] m_Data;
        m_Data     = NULL;
        m_Size     = 0;
        m_Capacity = 0;
    }

    void _swap(ArrayListAB& other) {
        T* _data         = m_Data;
        size_t _size     = m_Size;
        size_t _capacity = m_Capacity;

        m_Data     = other.m_Data;
        m_Size     = other.m_Size;
        m_Capacity = other.m_Capacity;

        other.m_Data     = _data;
        other.m_Size     = _size;
        other.m_Capacity = _capacity;
    }
};

#endif
