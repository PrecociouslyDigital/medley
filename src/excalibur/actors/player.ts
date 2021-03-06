import * as ex from 'excalibur';
import { createSelector } from 'reselect';
import store, { StoreState } from '../../store/store'; 

export class Player extends ex.Actor {
    private speed : number = 100;
    private notTalking : boolean = true;
    constructor(){
        super({
            pos: new ex.Vector(0,0),
            width:64,
            height:64,
            collisionType:ex.CollisionType.Active,
            color:ex.Color.Red
        });
        const talkingSelector = createSelector(({gameState} : StoreState)=>gameState.currentConversation, (convo)=>convo == null);
        store.subscribe(() =>{
          this.notTalking = talkingSelector(store.getState());  
        });
    }
    public update(engine, delta) {
        super.update(engine, delta);
        let move : ex.Vector = new ex.Vector(0,0);
        if(this.notTalking){
            move.y -= engine.input.keyboard.isHeld(ex.Input.Keys.W) ? 1 : 0;
            move.y += engine.input.keyboard.isHeld(ex.Input.Keys.S) ? 1 : 0;
            move.x += engine.input.keyboard.isHeld(ex.Input.Keys.D) ? 1 : 0;
            move.x -= engine.input.keyboard.isHeld(ex.Input.Keys.A) ? 1 : 0;
        }
        
        if(move.distance() != 0)
            move = move.normalize().scale(this.speed);
        this.vel = move;
    }
}
