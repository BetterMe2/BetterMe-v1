import React, { useEffect, useState, PureComponent } from 'react';
import { useSelector, useStore } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Nav from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';
import { PieChart, Pie, Cell, Sector, ResponsiveContainer, Tooltip } from 'recharts';
import style from './NutritionPage.module.scss';
// pull state to get the user information and the last recipe clicked 
// display a piechart of the meal with sections for protien, fat and carbs as a portion of a 2000cal daily intake


 



function NutritionPage() {

    // save specifying param ID
    const { id } = useParams();
    // console.log('Here is the storage: ', window.localStorage.item)

    let item;
    //if there's an idea, get that specific id
    id ? item = window.localStorage.getItem('item'+id) : item = window.localStorage.getItem('item')
    // const item = window.localStorage.getItem('item');
    const recipe  = JSON.parse(item);
    // const { id } = useParams();
    // const [item, setItem] = useState(null);

    // const navigate = useNavigate();

    // const user = useSelector(state => state.user.user);


    console.log(recipe.title);
    //pulling the grams and multipying by the corresponding Caloric density
    const proteinCalories = Number((recipe.nutrition.nutrients[8].amount * 4).toFixed(2))
    const carbCalories = Number((recipe.nutrition.nutrients[3].amount * 4).toFixed(2))
    const fatCalories = Number((recipe.nutrition.nutrients[1].amount * 9).toFixed(2))
    const dailyRemainingCalories = Number((2000 - proteinCalories - carbCalories - fatCalories).toFixed(2));
    const dailyVal = Math.floor(((proteinCalories+carbCalories+fatCalories)/2000)*100)
    // setting pie chart data
    const data = [
        {name:'Protein', calories:proteinCalories},
        {name:'Fats', calories:fatCalories},
        {name:'Carbohydrate', calories:carbCalories},
        {name:'Daily Remaining Calories', calories:dailyRemainingCalories},
    ];
    
    const getIntroOfPage = (label) => {
      if (label === 'Protein') {
        return "Calories from protein";
      }
      if (label === 'Fats') {
        return "Calories from fats";
      }
      if (label === 'Carbohydrate') {
        return "Calories from carbohydrate";
      }
      if (label === 'Daily Total') {
        return 'Remaining calories for the day';
      }
      return '';
    };
    //setting a color array for pieChart cells
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const RADIAN = Math.PI / 180;
    // Func to generate percentage based labels for the pie chart
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index
      }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        return (
          <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
          >
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
      };

      const CustomTooltip = ({ active, payload, label }) => {
        console.log ("label",payload)
        if (active && payload && payload.length) {
          return (
            <div className="custom-tooltip" viewBox={{ x: 0, y: 0, width: 200, height: 200 }}>
              <p className="label">{`${payload[0].name} : ${payload[0].value}`}cals</p>
              <p className="intro">{getIntroOfPage(label)}</p>
              <p className="desc">*Based on a 2000cal/day allowance,</p>
              <p> your individual requirements may be different</p>
            </div>
          );
        }
      
        return null;
      };
  
      

    return (
        <>
            <Nav transition={true}/>
                <div className={style.pieChart}>
                  <div className='foodInfo'>
                    <ul className='ulBullets'>
                    <div className='recipeTITLE'><b><li>{recipe.title}</li></b></div><hr/>
                      <li><b>Total Calories:</b> {recipe.nutrition.nutrients[0].amount}</li>
                      <li><b>Protein:</b> {recipe.nutrition.nutrients[8].amount} Grams</li>
                      <li><b>Carboydrates:</b> {recipe.nutrition.nutrients[3].amount} Grams</li>
                      <li><b>Daily Caloric Intake:</b> {dailyVal}%</li>
                    </ul>
                  </div>
                 
                    <PieChart width={700} height={700}>
                    <Tooltip content={<CustomTooltip/>} />
                        <Pie data = {data} dataKey= "calories" 
                         paddingAngle= {3} 
                         label={renderCustomizedLabel} 
                         outerRadius={250} 
                         innerRadius={175} 
                         fill="#8884d8">
                         {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}   
                        
                        </Pie>
                    </PieChart>
                   
                </div>
            <Footer />
        </>
    )

}
export default NutritionPage;
