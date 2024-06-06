import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const signUp = createAsyncThunk('user/signUp', async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue('User already exists');
      }
      return data;
    } catch (error) {
      return rejectWithValue('An unexpected error occurred. Please try again later');
    }
  });

export const signIn = createAsyncThunk('user/signIn', async (formData, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) {
        const errorMessage = data.message || 'Invalid credentials';
        return rejectWithValue(errorMessage);
    }
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading: false,
    errorMessage: '',
    successMessage: '',
    userInfo: null,
  },
  reducers: {
    clearMessages(state) {
      state.errorMessage = '';
      state.successMessage = '';
    },
    setValidationError(state, action) {
        state.errorMessage = action.payload;
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
        state.successMessage = '';
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Signed in successfully';
        state.userInfo = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || 'An unexpected error occurred. Please try again later';
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
        state.successMessage = '';
      })
      .addCase(signUp.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'User created successfully';
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || 'An unexpected error occurred. Please try again later';
      });
  },
});

export const { clearMessages, setValidationError } = userSlice.actions;
export default userSlice.reducer;
