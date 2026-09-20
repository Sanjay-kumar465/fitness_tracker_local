import React, { useState, useEffect } from 'react';
import { 
  getUserNutrition, 
  createNutritionEntry, 
  getRole, 
  getTargetUsers, 
  getMyDietPlans, 
  getDietPlansByUser, 
  createDietPlan,
  completeDietPlan
} from '../api';
import { Utensils, Plus, Calendar, Flame, Target, User, ChevronDown, ChevronUp, ShieldCheck, CheckCircle, Beef, Wheat, Droplet, Info } from 'lucide-react';

const NutritionPage = () => {
  const [entries, setEntries] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRoleState] = useState(() => getRole() || 'USER');

  const handleCompleteDiet = async (plan) => {
    try {
      await completeDietPlan(plan.id, plan);
      alert(`Meal routine completed! Notification sent to Nutritionist (${plan.nutritionistName || 'Staff'}).`);
      loadNutritionData();
    } catch (e) {
      alert('Failed to update meal completion status');
    }
  };

  // Form States for Meal Logger
  const [targetUserId, setTargetUserId] = useState('');
  const [targetUsersList, setTargetUsersList] = useState([]);
  const [foodItem, setFoodItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [mealType, setMealType] = useState('BREAKFAST');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Form States for Diet Plan Creation (Nutritionist / Admin)
  const [showPlanCreator, setShowPlanCreator] = useState(false);
  const [planTargetUserId, setPlanTargetUserId] = useState('');
  const [planName, setPlanName] = useState('');
  const [planGoal, setPlanGoal] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [dailyCalories, setDailyCalories] = useState('');
  const [proteinTarget, setProteinTarget] = useState('');
  const [carbsTarget, setCarbsTarget] = useState('');
  const [fatTarget, setFatTarget] = useState('');
  const [planFoods, setPlanFoods] = useState([]);

  // Food Item inputs inside Plan Creator
  const [pFoodName, setPFoodName] = useState('');
  const [pMealType, setPMealType] = useState('BREAKFAST');
  const [pCalories, setPCalories] = useState('');
  const [pProtein, setPProtein] = useState('');
  const [pCarbs, setPCarbs] = useState('');
  const [pFats, setPFats] = useState('');

  const loadNutritionData = async (selectedTargetId) => {
    try {
      setLoading(true);
      const currentRole = getRole() || 'USER';
      setRoleState(currentRole);

      const targetId = (selectedTargetId !== undefined && typeof selectedTargetId !== 'object') 
        ? selectedTargetId 
        : targetUserId;

      const [nutritionData, plansData] = await Promise.all([
        getUserNutrition(targetId),
        targetId ? getDietPlansByUser(targetId) : getMyDietPlans()
      ]);
      setEntries(nutritionData || []);
      setDietPlans(plansData || []);
      setError(null);
    } catch (err) {
      setError('Unable to load nutrition data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNutritionData();
    const fetchTargets = async () => {
      const list = await getTargetUsers();
      setTargetUsersList(list || []);
    };
    fetchTargets();
    window.addEventListener('mockDataLoaded', loadNutritionData);
    window.addEventListener('profileUpdated', loadNutritionData);
    window.addEventListener('roleUpdated', loadNutritionData);
    return () => {
      window.removeEventListener('mockDataLoaded', loadNutritionData);
      window.removeEventListener('profileUpdated', loadNutritionData);
      window.removeEventListener('roleUpdated', loadNutritionData);
    };
  }, []);

  const normRole = (role || '').toUpperCase();
  const isTrainer = normRole.includes('TRAINER');
  const isNutritionist = normRole.includes('NUTRITIONIST');
  const isAdmin = normRole.includes('ADMIN');

  const handleSubmitMeal = async (e) => {
    e.preventDefault();
    if (isTrainer) {
      alert('Trainers do not have permission to create or log nutrition entries per platform access policy.');
      return;
    }
    if (!foodItem.trim() || !quantity || !calories) {
      alert('Please fill all required fields');
      return;
    }

    const macros = `C:${carbs || 0}g, P:${protein || 0}g, F:${fat || 0}g`;
    const formattedDate = `${date}T12:00:00`;

    const payload = {
      foodItem,
      quantity: Number(quantity),
      calories: Number(calories),
      macronutrients: macros,
      mealType,
      date: formattedDate,
      targetUserId
    };

    try {
      await createNutritionEntry(payload);
      alert('Nutrition entry logged!');
      
      setFoodItem('');
      setQuantity('');
      setCalories('');
      setCarbs('');
      setProtein('');
      setFat('');
      setMealType('BREAKFAST');
      setDate(new Date().toISOString().split('T')[0]);
      loadNutritionData();
    } catch (err) {
      alert('Failed to log nutrition entry');
    }
  };

  const handleAddPlanFood = (e) => {
    e.preventDefault();
    if (!pFoodName.trim() || !pCalories) {
      alert('Food Name and Calories are required');
      return;
    }
    const newFood = {
      id: Date.now(),
      foodName: pFoodName,
      mealType: pMealType,
      quantity: 1.0,
      calories: Number(pCalories),
      protein: Number(pProtein || 0),
      carbohydrates: Number(pCarbs || 0),
      fats: Number(pFats || 0)
    };
    setPlanFoods([...planFoods, newFood]);
    setPFoodName('');
    setPCalories('');
    setPProtein('');
    setPCarbs('');
    setPFats('');
  };

  const handleCreateDietPlan = async (e) => {
    e.preventDefault();
    if (!planName.trim() || !dailyCalories) {
      alert('Plan Name and Daily Calories Target are required');
      return;
    }

    const planPayload = {
      userId: planTargetUserId ? Number(planTargetUserId) : undefined,
      planName,
      goal: planGoal || 'General Wellness',
      description: planDescription,
      dailyCalories: Number(dailyCalories),
      proteinTarget: Number(proteinTarget || 120),
      carbsTarget: Number(carbsTarget || 180),
      fatTarget: Number(fatTarget || 60),
      startDate: new Date().toISOString().split('T')[0],
      foods: planFoods
    };

    try {
      await createDietPlan(planPayload);
      alert('User-Specific Diet Plan created successfully!');
      setPlanName('');
      setPlanGoal('');
      setPlanDescription('');
      setDailyCalories('');
      setProteinTarget('');
      setCarbsTarget('');
      setFatTarget('');
      setPlanFoods([]);
      setShowPlanCreator(false);
      loadNutritionData();
    } catch (err) {
      alert('Failed to create diet plan');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="app-header">
        <div>
          <h1 className="page-title">Nutrition & Diet Management</h1>
          <p style={{ fontSize: '14px', color: '#6B5E5B', marginTop: '4px' }}>
            {isTrainer
              ? 'View nutritional details, diet plans, and recorded meal logs.'
              : 'Monitor assigned nutritionist diet plans, track calories, and log meal intake.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {(isNutritionist || isAdmin) && (
            <button 
              className="btn btn-primary" 
              onClick={() => setShowPlanCreator(!showPlanCreator)}
              style={{ fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> {showPlanCreator ? 'Close Plan Form' : 'Assign Diet Plan to Client'}
            </button>
          )}
          <span className={`tag ${isTrainer ? 'tag-paused' : 'tag-active'}`} style={{ fontSize: '12.8px', padding: '6.4px 12.8px' }}>
            {isTrainer ? 'Trainer View (Read Only)' : `${role} Access`}
          </span>
        </div>
      </div>

      {isTrainer && (
        <div className="alert alert-info" style={{ backgroundColor: '#FEF9E7', borderColor: '#F1C40F', color: '#7D6608' }}>
          <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Info size={16} /> Role Access Notice:</strong> As a <strong>Fitness Trainer</strong>, you can view nutritional information and meal logs, but nutrition tracking and diet plan creation are managed by Certified Nutritionists per platform RBAC policy.
        </div>
      )}

      {/* Creator Form for Nutritionist / Admin */}
      {showPlanCreator && (isNutritionist || isAdmin) && (
        <div className="content-card" style={{ borderTop: '4px solid #10B981', backgroundColor: '#F0FDF4' }}>
          <h3 className="card-title" style={{ color: '#065F46', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Utensils size={20} color="#10B981" /> Create User-Specific Diet Plan
          </h3>

          <form onSubmit={handleCreateDietPlan}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ color: '#065F46', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={16} /> Select Client Member (Target User)
              </label>
              <select
                className="form-control"
                value={planTargetUserId}
                onChange={(e) => setPlanTargetUserId(e.target.value)}
                style={{ borderColor: '#A7F3D0', backgroundColor: '#FFFFFF', fontWeight: '700' }}
                required
              >
                <option value="">-- Choose Client User --</option>
                {targetUsersList.map(u => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g. Lean Muscle & Metabolic Diet"
                  className="form-control"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Goal / Objective</label>
                <input
                  type="text"
                  placeholder="e.g. Weight Loss / Fat Burning"
                  className="form-control"
                  value={planGoal}
                  onChange={(e) => setPlanGoal(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Daily Calories Target (kcal)</label>
                <input
                  type="number"
                  placeholder="e.g. 2100"
                  className="form-control"
                  value={dailyCalories}
                  onChange={(e) => setDailyCalories(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Protein Target (g)</label>
                <input
                  type="number"
                  placeholder="e.g. 140"
                  className="form-control"
                  value={proteinTarget}
                  onChange={(e) => setProteinTarget(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Carbs Target (g)</label>
                <input
                  type="number"
                  placeholder="e.g. 200"
                  className="form-control"
                  value={carbsTarget}
                  onChange={(e) => setCarbsTarget(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Fat Target (g)</label>
                <input
                  type="number"
                  placeholder="e.g. 60"
                  className="form-control"
                  value={fatTarget}
                  onChange={(e) => setFatTarget(e.target.value)}
                />
              </div>
            </div>

            {/* Planned Foods Input Section */}
            <div style={{ marginTop: '16px', backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#065F46', marginBottom: '12px' }}>
                Add Prescribed Food Items to Plan
              </h4>

              {planFoods.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  {planFoods.map((pf, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', backgroundColor: '#F0FDF4', borderRadius: '6px', marginBottom: '6px', fontSize: '13px' }}>
                      <span><strong>{pf.foodName}</strong> ({pf.mealType}) - {pf.calories} kcal [P:{pf.protein}g, C:{pf.carbohydrates}g, F:{pf.fats}g]</span>
                      <button type="button" onClick={() => setPlanFoods(planFoods.filter((_, i) => i !== idx))} style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}>Remove</button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                <input type="text" placeholder="Food Name" className="form-control" value={pFoodName} onChange={(e) => setPFoodName(e.target.value)} />
                <select className="form-control" value={pMealType} onChange={(e) => setPMealType(e.target.value)}>
                  <option value="BREAKFAST">Breakfast</option>
                  <option value="LUNCH">Lunch</option>
                  <option value="DINNER">Dinner</option>
                  <option value="SNACK">Snack</option>
                </select>
                <input type="number" placeholder="kcal" className="form-control" value={pCalories} onChange={(e) => setPCalories(e.target.value)} />
                <input type="number" placeholder="P (g)" className="form-control" value={pProtein} onChange={(e) => setPProtein(e.target.value)} />
                <input type="number" placeholder="C (g)" className="form-control" value={pCarbs} onChange={(e) => setPCarbs(e.target.value)} />
                <input type="number" placeholder="F (g)" className="form-control" value={pFats} onChange={(e) => setPFats(e.target.value)} />
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddPlanFood}>+ Add</button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '16px', backgroundColor: '#059669', borderColor: '#059669' }}>
              Save & Assign Diet Plan to Client
            </button>
          </form>
        </div>
      )}

      {/* 1. Assigned Diet Plans Prominent Display Section */}
      {dietPlans.length > 0 && (
        <div className="content-card" style={{ borderTop: '4px solid #10B981', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 className="card-title" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Utensils size={20} color="#10B981" /> Assigned Diet & Nutrition Plans
            </h2>
            <span className="tag tag-active" style={{ fontSize: '12px', padding: '4px 10px' }}>
              {dietPlans.length} Active Plan{dietPlans.length > 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {dietPlans.map(plan => (
              <div key={plan.id} style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#111827', margin: 0 }}>{plan.planName}</h3>
                    <p style={{ fontSize: '13px', color: '#4B5563', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Target size={14} color="var(--primary-color)" /> Goal: <strong>{plan.goal || 'Nutrition Target'}</strong></span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Flame size={14} color="#EF4444" /> Daily Target: <strong>{plan.dailyCalories || 2000} kcal</strong></span>
                    </p>
                  </div>
                  <span className="tag tag-active" style={{ fontSize: '11px', padding: '3px 8px' }}>{plan.status || 'ACTIVE'}</span>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#374151', backgroundColor: '#FFFFFF', padding: '10px 16px', borderRadius: '8px', border: '1px solid #F3F4F6', margin: '12px 0' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Beef size={14} color="#DC2626" /> Protein: <strong>{plan.proteinTarget || 0}g</strong></span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Wheat size={14} color="#D97706" /> Carbs: <strong>{plan.carbsTarget || 0}g</strong></span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Droplet size={14} color="#10B981" /> Fats: <strong>{plan.fatTarget || 0}g</strong></span>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '13px', color: '#1E40AF', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', padding: '4px 10px', borderRadius: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <User size={14} color="#1E40AF" /> Assigned Client Member: <strong>{plan.userName || (plan.user && plan.user.username) || 'Client User'}</strong>
                  </div>
                  {plan.nutritionistName && (
                    <div style={{ fontSize: '12px', color: '#059669', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Assigned by Nutritionist: {plan.nutritionistName}
                    </div>
                  )}
                </div>
                  {plan.status !== 'COMPLETED' && !isTrainer && (
                    <button 
                      onClick={() => handleCompleteDiet(plan)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '12px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0', fontWeight: '700' }}
                    >
                      <CheckCircle size={14} /> Mark Meal Routine Completed
                    </button>
                  )}

                {/* Planned Foods Table */}
                {plan.foods && plan.foods.length > 0 && (
                  <div style={{ marginTop: '12px', borderTop: '1px solid #E5E7EB', paddingTop: '12px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#374151', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Prescribed Food Routines & Meals
                    </h4>
                    <div className="responsive-table-container">
                      <table className="table" style={{ margin: 0, fontSize: '13px' }}>
                        <thead>
                          <tr>
                            <th>Meal Type</th>
                            <th>Food Item</th>
                            <th>Calories</th>
                            <th>Protein</th>
                            <th>Carbs</th>
                            <th>Fats</th>
                          </tr>
                        </thead>
                        <tbody>
                          {plan.foods.map((food, fIdx) => (
                            <tr key={food.id || fIdx}>
                              <td><span className={`tag ${getMealTypeClass(food.mealType)}`}>{food.mealType}</span></td>
                              <td style={{ fontWeight: '600' }}>{food.foodName}</td>
                              <td>{food.calories} kcal</td>
                              <td>{food.protein || 0}g</td>
                              <td>{food.carbohydrates || 0}g</td>
                              <td>{food.fats || 0}g</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Recorded Meals Grid */}
      <div className={isTrainer ? 'content-card' : 'dashboard-grid'}>
        {/* Left Column: Nutrition Log List */}
        <div style={{ width: '100%' }}>
          <div className="content-card" style={isTrainer ? { border: 'none', padding: 0 } : {}}>
            <h2 className="card-title" style={{ marginBottom: '24px' }}>Recorded Daily Meal Logs</h2>

            {(isTrainer || isNutritionist || isAdmin) && (
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #A7F3D0', borderRadius: '8px', padding: '14px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#065F46', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={16} /> Inspect Client Nutrition Log
                    </h4>
                    <p style={{ fontSize: '12px', color: '#059669', margin: '2px 0 0 0' }}>
                      Select a specific client to filter their daily meal intake, calories, and macronutrient logs.
                    </p>
                  </div>
                  <select
                    className="form-control"
                    value={targetUserId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTargetUserId(val);
                      loadNutritionData(val);
                    }}
                    style={{ width: 'auto', minWidth: '220px', fontWeight: '700', borderColor: '#A7F3D0', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="">All Clients / Current Account</option>
                    {targetUsersList.map(u => (
                      <option key={u.id} value={u.id}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {loading ? (
              <p>Loading nutrition logs...</p>
            ) : entries.length === 0 ? (
              <p>No meal logs recorded for this account yet.</p>
            ) : (
              <div className="responsive-table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Client Member</th>
                      <th>Meal Type</th>
                      <th>Food / Meal Name</th>
                      <th>Quantity</th>
                      <th>Calories</th>
                      <th>Macronutrients</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map(entry => (
                      <tr key={entry.id}>
                        <td style={{ fontSize: '12px', color: '#6B7280' }}>{entry.date ? String(entry.date).replace('T', ' ') : '-'}</td>
                        <td style={{ fontWeight: '700', color: '#1E40AF' }}>{entry.userName || (entry.user && entry.user.username) || 'Client Member'}</td>
                        <td>
                          <span className={`tag ${getMealTypeClass(entry.mealType)}`}>
                            {entry.mealType || 'MEAL'}
                          </span>
                        </td>
                        <td><strong>{entry.foodItem}</strong></td>
                        <td>{entry.quantity}</td>
                        <td><span className="tag tag-active" style={{ fontWeight: '700' }}>{entry.calories} kcal</span></td>
                        <td style={{ fontSize: '12px', color: '#4B5563', fontWeight: '500' }}>{entry.macronutrients || 'Balanced'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Nutrition Logger Form (Hidden for Trainer) */}
        {!isTrainer && (
          <div>
            <div className="content-card">
              <h3 className="card-title" style={{ marginBottom: '24px' }}>Log Daily Meal</h3>
              
              <form onSubmit={handleSubmitMeal}>
                {(isNutritionist || isAdmin) && (
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ color: '#DC2626', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={16} /> Select Client / Target User
                    </label>
                    <select
                      className="form-control"
                      value={targetUserId}
                      onChange={(e) => setTargetUserId(e.target.value)}
                      style={{ borderColor: '#FCA5A5', backgroundColor: '#FEF2F2', fontWeight: '700' }}
                    >
                      <option value="">Self (Current Account)</option>
                      {targetUsersList.map(u => (
                        <option key={u.id} value={u.id}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                )}

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
                <div style={{ marginTop: '24px', marginBottom: '24px', borderTop: '1px solid #DCD2CE', paddingTop: '24px' }}>
                  <h4 style={{ fontSize: '14.4px', fontWeight: 600, marginBottom: '12.8px' }}>Macronutrients (Optional)</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>Carbs (g)</label>
                      <input
                        type="number"
                        placeholder="g"
                        className="form-control"
                        value={carbs}
                        onChange={(e) => setCarbs(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>Protein (g)</label>
                      <input
                        type="number"
                        placeholder="g"
                        className="form-control"
                        value={protein}
                        onChange={(e) => setProtein(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>Fat (g)</label>
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
        )}
      </div>
    </div>
  );
};

export default NutritionPage;
