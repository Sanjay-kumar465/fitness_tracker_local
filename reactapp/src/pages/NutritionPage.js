import React, { useState, useEffect } from 'react';
import { getUserNutrition, createNutritionEntry } from '../api';

const NutritionPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form States
  const [foodItem, setFoodItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [mealType, setMealType] = useState('BREAKFAST');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const loadNutrition = async () => {
    try {
      setLoading(true);
      const data = await getUserNutrition();
      setEntries(data || []);
      setError(null);
    } catch (err) {
      setError('Unable to load nutrition entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNutrition();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodItem.trim() || !quantity || !calories) {
      alert('Please fill all required fields');
      return;
    }

    // Combine macros into a simple formatted string
    const macros = `C:${carbs || 0}g, P:${protein || 0}g, F:${fat || 0}g`;

    // Format date as LocalDateTime (YYYY-MM-DDTHH:MM:SS)
    const formattedDate = `${date}T12:00:00`;

    const payload = {
      foodItem,
      quantity: Number(quantity),
      calories: Number(calories),
      macronutrients: macros,
      mealType,
      date: formattedDate
    };

    try {
      await createNutritionEntry(payload);
      alert('Nutrition entry logged!');
      
      // Reset form
      setFoodItem('');
      setQuantity('');
      setCalories('');
      setCarbs('');
      setProtein('');
      setFat('');
      setMealType('BREAKFAST');
      setDate(new Date().toISOString().split('T')[0]);
      loadNutrition();
    } catch (err) {
      alert('Failed to log nutrition entry');
    }
  };

  const getMealTypeClass = (type) => {
    switch (type) {
      case 'BREAKFAST':
        return 'tag-active';
      case 'LUNCH':
        return 'tag-completed';
      case 'DINNER':
        return 'tag-paused';
      case 'SNACK':
      default:
        return 'tag-low';
    }
  };

  const formatDateLabel = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    return dateTimeStr.split('T')[0];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="app-header">
        <h1 className="page-title">Nutrition</h1>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Nutrition Log List */}
        <div>
          <div className="content-card">
            <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>Meals Recorded</h2>

            {loading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : entries.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-2h2v2zm0-4H9V7h2v6zm4 4h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                <div className="empty-title">No meals recorded yet</div>
                <div className="empty-subtitle">Log what you eat on the right to track calories.</div>
              </div>
            ) : (
              <div className="responsive-table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Meal</th>
                      <th>Type</th>
                      <th>Quantity</th>
                      <th>Calories</th>
                      <th>Macronutrients</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id}>
                        <td style={{ fontWeight: '600' }}>{entry.foodItem}</td>
                        <td>
                          <span className={`tag ${getMealTypeClass(entry.mealType)}`}>
                            {entry.mealType}
                          </span>
                        </td>
                        <td>{entry.quantity}</td>
                        <td>{entry.calories} kcal</td>
                        <td style={{ fontSize: '0.85rem', color: '#6B5E5B' }}>
                          {entry.macronutrients || 'N/A'}
                        </td>
                        <td>{formatDateLabel(entry.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Nutrition Logger Form */}
        <div>
          <div className="content-card">
            <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>Log Meal</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Food Item</label>
                <input
                  type="text"
                  placeholder="e.g. Oatmeal with banana"
                  className="form-control"
                  value={foodItem}
                  onChange={(e) => setFoodItem(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 1.5"
                    className="form-control"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Calories (kcal)</label>
                  <input
                    type="number"
                    placeholder="e.g. 350"
                    className="form-control"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Meal Type</label>
                <select
                  className="form-control"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                >
                  <option value="BREAKFAST">Breakfast</option>
                  <option value="LUNCH">Lunch</option>
                  <option value="DINNER">Dinner</option>
                  <option value="SNACK">Snack</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Optional Macronutrients section */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem', borderTop: '1px solid #DCD2CE', paddingTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.8rem' }}>Macronutrients (Optional)</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Carbs (g)</label>
                    <input
                      type="number"
                      placeholder="g"
                      className="form-control"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Protein (g)</label>
                    <input
                      type="number"
                      placeholder="g"
                      className="form-control"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Fat (g)</label>
                    <input
                      type="number"
                      placeholder="g"
                      className="form-control"
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Log Meal Entry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionPage;
